import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';
import * as server from '@/services/common';
import tree from '@/utils/tree';

type TakerEffect = (
  url: string,
  action: AnyAction,
  effects: EffectsCommandMap,
  model?: Function,
  name?: string,
) => void;

export interface TakeMapping {
  search: TakerEffect;
  create: TakerEffect;
  update: TakerEffect;
  remove: TakerEffect;
  detail: TakerEffect;
}

export function* TakeEffects(
  url: string,
  { type, payload, AddMode }: AnyAction,
  { call, put }: EffectsCommandMap,
  model?: Function,
  name?: string,
) {
  const [, mode]: string[] = type.split('/');

  // 确保请求方法正确
  if (!server || !mode || !server[mode]) {
    console.error('request method error.');
    return;
  }

  const newPayload = (mode === 'search') ? (payload || { page: 1, page_size: 10 }) : payload;

  // 更新请求状态，防止重复提交
  yield put({
    type: name || 'TakeReducers',
    payload: { args: newPayload, requesting: true },
  });

  // 发送请求
  const response = yield call(server[mode], url, newPayload);
  // console.log(response);

  // let newResponse = {};
  // if (mode === 'search') {
  //   const { total = 0, per_page: pageSize = 20, current_page: current = 1, data = [] } = response;
  //   newResponse = {
  //     data,
  //     page: { current, pageSize, total },
  //   };
  // } else if (mode === 'create') {
  //   newResponse = {
  //     data: response,
  //   };
  // }

  // 接收返回，更新请求状态
  yield put({
    type: name || 'TakeReducers',
    payload: { response, AddMode, requesting: false },
    mode,
  });
}

export function TakeReducers(state: any, action: any) {
  const { args, response, requesting, AddMode = 'push' } = action.payload;

  // 更新请求状态
  if (requesting) {
    return { ...state, args, requesting };
  }

  // mode: search
  if (action.mode === 'search') {
    const { total = 0, per_page: pageSize = 20, current_page: current = 1, data = [] } = response;
    return {
      ...state,
      page: { current, pageSize, total },
      list: tree.initialize(data),
      requesting: false,
    };
  }
  if (action.mode === 'create') {
    return {
      ...state,
      list: tree.insert(state.list, response, AddMode),
      requesting: false,
    };
  }
  if (action.mode === 'update') {
    // TODO 状态机中的 info 属性也需要更新
    return {
      ...state,
      list: tree.update(state.list, response),
    }
  }
  if (action.mode === 'remove' && response) {
    tree.remove(state.list, args);
    return {
      ...state,
    }
  }

  // console.log('TR');
  // console.log(action);
  // console.log(AddMode);

  return state;
}

import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';

type TakerEffect = (
  url: string,
  action: AnyAction,
  effects: EffectsCommandMap,
  model?: Function,
  name?: string,
) => void;

export interface TakeMapping {
  update: TakerEffect;
  search: TakerEffect;
  create: TakerEffect;
  detail: TakerEffect;
}

export const TE: TakeMapping = {
  *search(url, { payload }, { call, put }, model) {
    const response = yield call(model, url, payload || { page: 1, page_size: 10 });
    yield put({
      type: 'run',
      payload: response,
      mode: 'search',
    });
  },
  *update(url, { payload }, { call, put }, model) {
    yield put({
      type: 'run',
      payload: {
        ...payload,
        request_status: true,
      },
      mode: 'update',
    });
    const response = yield call(model, url, payload);
    yield put({
      type: 'run',
      payload: {
        ...response,
        request_status: false,
      },
      mode: 'update',
    });
  },
  *create(url, { payload }, { call, put }, model) {
    const response = yield call(model, url, payload);
    yield put({
      type: 'run',
      payload: response,
      mode: 'create',
    });
  },
  *detail(url, { payload }, { call, put }, model) {
    const response = yield call(model, url, payload);
    yield put({
      type: 'run',
      payload: response,
      mode: 'detail',
    });
  },
};

export const TR = {
  run(state: any, action: any) {
    return TR[action.mode](state, action);
  },
  search(state: any, action: any) {
    const {
      detail: info = {},
      data: list = [],
      current_page: current = 1,
      per_page: pageSize = 20,
      total = 0,
    } = action.payload;
    const page = { current, pageSize, total };
    return { ...state, page, list, info };
  },
  update(state: any, action: any) {
    if (state.list) {
      const newList = state.list.map((item: any) => {
        if (Number(item.id) === Number(action.payload.id)) {
          return {
            ...item,
            ...action.payload,
          };
        }
        return item;
      });
      return {
        ...state,
        list: newList,
      };
    }
    return state;
  },
  create(state: any, action: any) {
    console.log(state);
    console.log(action);

    return {};
  },
  detail(state: any, action: any) {
    return {
      ...state,
      info: action.payload,
    };
  },
};

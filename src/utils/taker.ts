import { EffectsCommandMap } from 'dva';
import { AnyAction } from 'redux';

type Effect = (
  url: string,
  action: AnyAction,
  effects: EffectsCommandMap,
  model?: Function,
  name?: string,
) => void;

export interface TakeMapping {
  reader: Effect,
  update: Effect,
  search: Effect,
  create: Effect,
}

export const TE: TakeMapping = {
  *reader(url, { payload }, { call, put }, model, name) {
    const response = yield call(model, url, payload || { page: 1, page_size: 10 });
    yield put({
      type: name,
      payload: response,
      mode: 'reader',
    });
  },
  *update(url, { payload }, { call, put }, model, name) {
    const response = yield call(model, url, payload);
    yield put({
      type: name,
      payload: response,
      mode: 'update',
    });
  },
  *search(url, { payload }, { call, put }, model, name) {
    const response = yield call(model, url, payload);
    yield put({
      type: name,
      payload: response,
      mode: 'search',
    });
  },
  *create(url, { payload }, { call, put }, model, name) {
    const response = yield call(model, url, payload);
    yield put({
      type: name,
      payload: response,
      mode: 'create',
    });
  },
};

export const TR = {
  run(state: any, action: any) {
    return this[action.mode](state, action);
  },
  reader(state: any, action: any) {
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
    console.log(state);
    console.log(action);

    return {};
  },
  search(state: any, action: any) {
    console.log(state);
    console.log(action);

    return {};
  },
  create(state: any, action: any) {
    console.log(state);
    console.log(action);

    return {};
  },
};

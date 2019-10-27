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
  [key: string]: Effect;
}

const taker: TakeMapping = {
  *reader(url, { payload }, { call, put }, model, name) {
    const response = yield call(model, url, payload || { page: 1, page_size: 10 });
    yield put({ type: name, payload: response });
  },
  *search(url, { payload }, { call, put }, model, name) {
    const response = yield call(model, url, payload);
    yield put({ type: name, payload: response });
  },
  *create(url, { payload }, { call, put }, model, name) {
    const response = yield call(model, url, payload);
    yield put({ type: name, payload: response });
  },
};

export default taker;

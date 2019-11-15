import { Effect } from 'dva';
import { Reducer } from 'redux';
import { search, update } from '@/services/common';
import { TE, TR } from '@/utils/taker';

const REQUEST_URL = '/todo';
const { run } = TR;

export interface DefaultModelItem {}

export interface DefaultModelType {
  namespace: 'default';
  state: GlobalDefaultModelState;
  effects: {
    update: Effect;
    search: Effect;
  };
  reducers: {
    [key: string]: Reducer<GlobalDefaultModelState>;
  };
}

const DefaultModel: DefaultModelType = {
  namespace: 'default',

  state: {
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *update(action, effects) {
      yield TE.update(REQUEST_URL, action, effects, update);
    },
    *search(action, effects) {
      yield TE.search(REQUEST_URL, action, effects, search);
    },
  },

  reducers: {
    run,
  },
};

export default DefaultModel;

import { Effect } from 'dva';
import { Reducer } from 'redux';
import { search, update } from '@/services/common';
import { TE, TR } from '@/utils/taker';

const { run } = TR;
const REQUEST_URL = '/todo';
const namespace = 'default';

export interface DefaultModelItem {
  //
}

export interface DefaultModelState extends GlobalDefaultModelState {
  //
}

export interface DefaultModelType {
  namespace: string | 'default';
  state: DefaultModelState;
  effects: {
    update: Effect;
    search: Effect;
  };
  reducers: {
    [key: string]: Reducer<DefaultModelState>;
  };
}

const DefaultModel: DefaultModelType = {
  namespace,

  state: {
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *search(action, effects) {
      yield TE.search(REQUEST_URL, action, effects, search);
    },
    *update(action, effects) {
      yield TE.update(REQUEST_URL, action, effects, update);
    },
  },

  reducers: {
    run,
  },
};

export default DefaultModel;

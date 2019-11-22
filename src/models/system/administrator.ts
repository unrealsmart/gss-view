import { Effect } from 'dva';
import { Reducer } from 'redux';
import { search, update } from '@/services/common';
import { TE, TR } from '@/utils/taker';

const { run } = TR;
const REQUEST_URL = '/main/administrator';
const namespace = 'administrator';

export interface AdministratorModelItem {
  id: number;
  domain: {
    [key: string]: any;
  };
  [key: string]: any;
}

export interface AdministratorModelState extends GlobalDefaultModelState {
  //
}

export interface AdministratorModelType {
  namespace: string | 'default';
  state: AdministratorModelState;
  effects: {
    update: Effect;
    search: Effect;
  };
  reducers: {
    [key: string]: Reducer<AdministratorModelState>;
  };
}

const DefaultModel: AdministratorModelType = {
  namespace,

  state: {
    args: {},
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

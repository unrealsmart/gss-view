import { Effect } from 'dva';
import { Reducer } from 'redux';
import { detail, search, update } from '@/services/common';
import { TE, TR } from '@/utils/taker';

const { run } = TR;
const REQUEST_URL = '/main/domain';
const namespace = 'domain';

export interface DomainModelItem {
  id: number;
  name: string;
  title: string;
  description: string;
  status: number | string | 0;
  create_time: number | string | '0000-00-00 00:00:00';
  update_time: number | string | '0000-00-00 00:00:00';
  [key: string]: any;
}

export interface DomainModelState extends GlobalDefaultModelState {
  //
}

export interface DomainModelType {
  namespace: string | 'default';
  state: DomainModelState;
  effects: {
    update: Effect;
    search: Effect;
    detail: Effect;
  };
  reducers: {
    [key: string]: Reducer<DomainModelState>;
  };
}

const DefaultModel: DomainModelType = {
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
    *detail(action, effects) {
      yield TE.detail(REQUEST_URL, action, effects, detail);
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

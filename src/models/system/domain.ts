import { Effect } from 'dva';
import { Reducer } from 'redux';
import * as server from '@/services/common';
import { structure } from '@/utils/utils';

export interface DomainModelItem {
  id: number;
  name: string;
  title: string;
  description: string;
  status: number | string | 0;
  create_time: number | string;
  update_time: number | string;
  [key: string]: any;
}

export interface DomainModelState extends GlobalModelState {
  //
}

export interface DomainModelType {
  namespace: string;
  state: DomainModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: Reducer<any>;
  };
}

const DomainModel: DomainModelType = {
  namespace: 'domain',

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(server.search, 'main/domain', payload);
      yield put({ type: 'save', mode: 'search', payload: response });
      return response;
    },
    *create({ payload }, { call, put }) {
      const response = yield call(server.create, 'main/domain', payload);
      yield put({ type: 'save', mode: 'create', payload: response });
    },
    *update({ payload }, { call, put }) {
      yield put({ type: 'save', mode: 'update', payload: { id: payload.id, loading: true } });
      const response = yield call(server.update, 'main/domain', payload);
      yield put({ type: 'save', mode: 'update', payload: { ...response, loading: false } });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(server.remove, 'main/domain', payload);
      if (response && !(response instanceof Response)) {
        yield put({ type: 'save', mode: 'remove', payload });
      }
    },
  },

  reducers: {
    save: (state, action) => structure(state, action),
  },
};

export default DomainModel;

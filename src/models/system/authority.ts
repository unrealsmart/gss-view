import { Effect } from 'dva';
import { Reducer } from 'redux';
import * as server from '@/services/common';
import { structure } from '@/utils/utils';

export interface AuthorityModelState extends GlobalModelState {
  //
}

export interface AuthorityModelType {
  namespace: string;
  state: AuthorityModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: Reducer<any>;
  };
}

const AuthorityModel: AuthorityModelType = {
  namespace: 'authority',

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(server.search, 'main/authority', payload);
      yield put({ mode: 'search', type: 'save', payload: response });
    },
    *create({ payload }, { call, put }) {
      const response = yield call(server.create, 'main/authority', payload);
      yield put({ type: 'save', mode: 'create', payload: response });
    },
    *update({ payload }, { call, put }) {
      yield put({ type: 'save', mode: 'update', payload: { id: payload.id, loading: true } });
      const response = yield call(server.update, 'main/authority', payload);
      yield put({ type: 'save', mode: 'update', payload: { ...response, loading: false } });
    },
    *remove({ payload }, { call, put }) {
      const response = yield call(server.remove, 'main/authority', payload);
      if (response && !(response instanceof Response)) {
        yield put({ type: 'save', mode: 'remove', payload });
      }
    },
  },

  reducers: {
    save: (state, action) => structure(state, action),
  },
};

export default AuthorityModel;

import { Effect } from 'dva';
import { AnyAction, Reducer } from 'redux';
import * as server from '@/services/common';
import { structure } from '@/utils/utils';

export interface AdministratorModelItem {
  id: number;
  username: string;
  domain: {
    [key: string]: any;
  };
  avatar: object[];
  email: string;
  phone: number | string;
  nickname: string;
  gender: number;
  description: string;
  status: number | string | 0;
  create_time: number | string;
  update_time: number | string;
  [key: string]: any;
}

export interface AdministratorModelState extends GlobalModelState {
  //
}

export interface AdministratorModelType {
  namespace: string;
  state: AdministratorModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: Reducer<any, AnyAction>;
  };
}

const DefaultModel: AdministratorModelType = {
  namespace: 'administrator',

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(server.search, 'main/administrator', payload);
      yield put({ mode: 'search', type: 'save', payload: response });
    },
    *detail({ payload }, { call, put }) {
      const response = yield call(server.detail, 'main/administrator', payload);
      yield put({ mode: 'detail', type: 'save', payload: response });
    },
  },

  reducers: {
    save(state, action) {
      return structure(state, action);
    },
  },
};

export default DefaultModel;

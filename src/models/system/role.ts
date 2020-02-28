import { Effect } from 'dva';
import { AnyAction, Reducer } from 'redux';
import * as server from '@/services/common';
import { structure } from '@/utils/utils';

export interface RoleModelType {
  namespace: string;
  state: GlobalModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: Reducer<GlobalModelState, AnyAction>;
  };
}

const RoleModel: RoleModelType = {
  namespace: 'role',

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *search({ payload }, { call, put }) {
      // const domain = yield call(server.search, 'main/domain');
      // yield put({ mode: 'search', type: 'domain/save', payload: domain });

      // const params = payload || { id: domain[0] && domain[0].id };

      const role = yield call(server.search, 'main/role', payload);
      yield put({ mode: 'search', type: 'save', payload: role });
    },
    // *create({ payload }, { call, put }) {
    //   const response = yield call(server.create, 'main/role', payload);
    //   yield put({ mode: 'create', type: 'save', payload: response });
    // },
    // *update({ payload }, { call, put }) {
    //   yield put({ type: 'save', mode: 'update', payload: { id: payload.id, loading: true } });
    //   const response = yield call(server.update, 'main/role', payload);
    //   yield put({ type: 'save', mode: 'update', payload: { ...response, loading: false } });
    // },
    // *remove({ payload }, { call, put }) {
    //   const response = yield call(server.remove, 'main/role', payload);
    //   if (response && !(response instanceof Response)) {
    //     yield put({ type: 'save', mode: 'remove', payload });
    //   }
    // },
  },

  reducers: {
    save: (state, action) => structure(state, action),
  },
};

export default RoleModel;

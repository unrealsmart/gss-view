import { Effect } from 'dva';
import { Reducer } from 'redux';
import * as server from '@/services/common';
import { structure } from '@/utils/utils';

export interface CategoryModelType {
  namespace: string;
  state: GlobalModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: Reducer;
  };
}

const CategoryModel: CategoryModelType = {
  namespace: 'category',

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(server.search, 'content/category', payload);
      yield put({ type: 'save', mode: 'search', payload: response });
    },
    *create({ payload }, { call, put }) {
      const response = yield call(server.create, 'content/category', payload);
      yield put({ type: 'save', mode: 'create', payload: response });
    },
    *update({ payload }, { call, put }) {
      const response = yield call(server.update, 'content/category', payload);
      yield put({ type: 'save', mode: 'update', payload: response });
    },
  },

  reducers: {
    save(state, action) {
      return structure(state, action);
    },
  },
};

export default CategoryModel;

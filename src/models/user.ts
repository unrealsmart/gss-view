import { Effect } from 'dva';
import { Reducer } from 'redux';
import isJSON from 'is-json';

import { query as queryUsers } from '@/services/user';

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { put }) {
      // TODO 1. 获取用户信息
      // TODO 2. 判断过期刷新
      const adpUser = localStorage.getItem('antd-pro-user') || '';
      const user = isJSON(adpUser) ? JSON.parse(adpUser) : {};
      if (!user || user === {}) {
        // const response = yield call(queryCurrent);
        // console.log(response);
      }

      yield put({
        type: 'saveCurrentUser',
        payload: {
          ...user,
          name: user.nickname || '未设置昵称',
          avatar:
            user.avatar.path || 'http://pic4.zhimg.com/v2-2bec6443e2ac527d19e2aaf8660fd863_b.jpg',
        },
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;

import { Effect } from 'dva';
import { Reducer } from 'redux';
import { query as queryUsers } from '@/services/user';
import { getCurrentUser } from '@/utils/storage';

export interface CurrentUser {
  id?: string;
  username?: string;
  avatar?: string;
  name?: string;
  nickname?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
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
      const adpUser: AdministratorModel = getCurrentUser();
      if (!adpUser || !adpUser.id) {
        yield put({
          type: 'login/logout',
        });
        return;
      }

      yield put({
        type: 'saveCurrentUser',
        payload: {
          ...adpUser,
          name: adpUser.nickname || '未设置昵称',
          avatar: typeof adpUser.avatar !== 'number' && adpUser.avatar.path,
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

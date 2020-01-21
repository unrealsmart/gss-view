import { Effect } from 'dva';
import { Reducer } from 'redux';
import { TakeEffects, TakeReducers } from '@/utils/take';

const url = '/main/administrator';
const namespace = 'administrator';

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
  create_time: number | string | '0000-00-00 00:00:00';
  update_time: number | string | '0000-00-00 00:00:00';
  [key: string]: any;
}

export interface AdministratorModelState extends GlobalModelState {
  //
}

export interface AdministratorModelType {
  namespace: string | 'default';
  state: AdministratorModelState;
  effects: {
    create: Effect;
    remove: Effect;
    update: Effect;
    search: Effect;
    detail: Effect;
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
    requesting: false,
  },

  effects: {
    *create(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *remove(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *update(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *search(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *detail(action, effects) {
      yield TakeEffects(url, action, effects);
    },
  },

  reducers: {
    TakeReducers,
  },
};

export default DefaultModel;

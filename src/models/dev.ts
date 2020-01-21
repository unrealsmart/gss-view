import { Effect } from 'dva';
import { Reducer } from 'redux';
import { TakeEffects, TakeReducers } from '@/utils/take';

const url = '/main/dev';
const namespace = 'dev';

export interface DevModelItem {
  id: number;
  name: string;
  title: string;
  description: string;
  status: number | string | 0;
  create_time: number | string | '0000-00-00 00:00:00';
  update_time: number | string | '0000-00-00 00:00:00';
  [key: string]: any;
}

export interface DevModelState extends GlobalModelState {
  //
}

export interface DomainModelType {
  namespace: string | 'default';
  state: DevModelState;
  effects: {
    search: Effect;
    create: Effect;
    update: Effect;
    remove: Effect;
    detail: Effect;
  };
  reducers: {
    [key: string]: Reducer<DevModelState>;
  };
}

const DevModel: DomainModelType = {
  namespace,

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
    requesting: false,
  },

  effects: {
    *search(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *create(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *update(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *remove(action, effects) {
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

export default DevModel;

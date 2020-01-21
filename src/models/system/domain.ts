import { Effect } from 'dva';
import { Reducer } from 'redux';
import { TakeEffects, TakeReducers } from '@/utils/take';

const url = '/main/domain';
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

export interface DomainModelState extends GlobalModelState {
  //
}

export interface DomainModelType {
  namespace: string | 'default';
  state: DomainModelState;
  effects: {
    search: Effect;
    create: Effect;
    update: Effect;
    detail: Effect;
  };
  reducers: {
    [key: string]: Reducer<DomainModelState>;
  };
}

const DomainModel: DomainModelType = {
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
    *detail(action, effects) {
      yield TakeEffects(url, action, effects);
    },
  },

  reducers: {
    TakeReducers,
  },
};

export default DomainModel;

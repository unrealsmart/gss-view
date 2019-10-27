import { Effect } from 'dva';
import { Reducer } from 'redux';
import { reader, search } from '@/services/common';
import taker from '@/utils/taker';

export interface EarnTaskModelItem {
  id: number;
  country_name: string;
  city_name: string;
  check_in_date: string;
  check_out_date: string;
  nationality?: string | 'CN';
  adult: number;
  children: number;
  children_age: string | '';
  room_count: number;
  currency?: string | 'CNY';
}

export interface EarnTaskModelState {
  page?: {
    current?: number | 1;
    size?: number | 20;
    last?: number | null;
    total?: number | null;
  };
  list?: [];
  info?: EarnTaskModelItem | object;
}

export interface EarnTaskModelType {
  namespace: 'earnTask';
  state: EarnTaskModelState;
  effects: {
    reader: Effect;
    search: Effect;
  };
  reducers: {
    saveEarnTask: Reducer<EarnTaskModelState>;
  };
}

const EarnTaskModel: EarnTaskModelType = {
  namespace: 'earnTask',

  state: {
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *reader(action, effects) {
      yield taker.reader('/earn/task', action, effects, reader, 'saveEarnTask');
    },
    *search(action, effects) {
      yield taker.search('/earn/task', action, effects, search, 'saveEarnTask');
    },
  },

  reducers: {
    saveEarnTask(state, action) {
      const {
        detail: info = {},
        data: list = [],
        current_page: current = 1,
        per_page: pageSize = 20,
        total,
      } = action.payload;
      const page = { current, pageSize, total };
      return { ...state, page, list, info };
    },
  },
};

export default EarnTaskModel;

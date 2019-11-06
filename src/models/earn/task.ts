import { Effect } from 'dva';
import { Reducer } from 'redux';
import { reader, search } from '@/services/common';
import { TE } from '@/utils/taker';
import { runCrawlTask } from '@/services/task';

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
  task: {
    check_in_date: string;
    check_out_date: string;
    city_name: string;
    country_name: string;
    current: number;
    count: number;
    current_hotel: string;
    thread_name: string;
    thread_status: string;
  };
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
    runCrawlTask: Effect;
  };
  reducers: {
    saveEarnTask: Reducer<EarnTaskModelState>;
    updateEarnTask: Reducer<EarnTaskModelState>;
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
      yield TE.reader('/earn/task', action, effects, reader, 'saveEarnTask');
    },
    *search(action, effects) {
      yield TE.search('/earn/task', action, effects, search, 'saveEarnTask');
    },
    *runCrawlTask({ payload }, { call, put }) {
      const response = yield call(runCrawlTask, payload);
      yield put({
        type: 'updateEarnTask',
        payload: response,
      });
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
      if (action.payload.data && action.payload.detail) {
        const page = { current, pageSize, total };
        return { ...state, page, list, info };
      }
      return {
        ...state,
        list: action.payload,
      };
    },
    updateEarnTask(state: any, action) {
      let newList = {};
      if (state.list) {
        newList = state.list.map((item: any) => {
          if (item.task.thread_name === action.payload.thread_name) {
            return {
              ...item,
              task: action.payload,
            };
          }
          return item;
        });
      }
      return {
        ...state,
        list: newList,
      };
    },
  },
};

export default EarnTaskModel;

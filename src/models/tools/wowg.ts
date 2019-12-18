import { Effect, EffectsCommandMap } from 'dva';
import { Reducer, AnyAction } from 'redux';
import { search, update } from '@/services/common';
import { TE, TR } from '@/utils/taker';
import { dateList } from '@/services/tools/wowg';

const { run } = TR;
const REQUEST_URL = '/tools/wow-gold';
const namespace = 'wowg';

type dateListItem = {
  id: number;
  collect_time: string;
};

export interface WOWGModelItem {
  //
}

export interface WOWGModelState extends GlobalDefaultModelState {
  dateList: Array<dateListItem>;
}

export interface DefaultModelType {
  namespace: string | 'default';
  state: WOWGModelState;
  effects: {
    update: Effect;
    search: Effect;
    dateList: Effect;
  };
  reducers: {
    saveDateList: Reducer;
    [key: string]: Reducer;
  };
}

const WOWGModel: DefaultModelType = {
  namespace,

  state: {
    page: {},
    list: [],
    info: {},
    dateList: [],
  },

  effects: {
    *search(action, effects) {
      yield TE.search(REQUEST_URL, action, effects, search);
    },
    *update(action, effects) {
      yield TE.update(REQUEST_URL, action, effects, update);
    },
    *dateList(_: AnyAction, { call, put }: EffectsCommandMap) {
      const response = yield call(dateList);
      yield put({
        type: 'saveDateList',
        payload: response,
      });
    },
  },

  reducers: {
    run,
    saveDateList(state, { payload }) {
      return {
        ...state,
        dateList: payload,
      };
    },
  },
};

export default WOWGModel;

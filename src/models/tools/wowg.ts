import { Effect, EffectsCommandMap } from 'dva';
import { Reducer, AnyAction } from 'redux';
import { TakeEffects, TakeReducers } from '@/utils/take';
import { dateList } from '@/services/tools/wowg';

const url = '/tools/wow-gold';
const namespace = 'wowg';

type dateListItem = {
  id: number;
  collect_time: string;
};

export interface WOWGModelItem {
  //
}

export interface WOWGModelState extends GlobalModelState {
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
    args: {},
    page: {},
    list: [],
    info: {},
    requesting: false,
    dateList: [],
  },

  effects: {
    *search(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *update(action, effects) {
      yield TakeEffects(url, action, effects);
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
    TakeReducers,
    saveDateList(state, { payload }) {
      return {
        ...state,
        dateList: payload,
      };
    },
  },
};

export default WOWGModel;

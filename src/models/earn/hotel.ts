import { Effect } from 'dva';
import { Reducer } from 'redux';
import { reader, search } from '@/services/common';
import taker from '@/utils/taker';

export interface EarnHotelModelItem {
  id: number;
  code: string;
  name_cn: string;
  name_en: string;
  address_cn: string;
  address_en: string;
}

export interface EarnHotelModelState {
  page?: {
    current?: number | 1;
    size?: number | 20;
    last?: number | null;
    total?: number | null;
  };
  list?: [];
  info?: EarnHotelModelItem | object;
}

export interface EarnHotelModelType {
  namespace: 'earnHotel';
  state: EarnHotelModelState;
  effects: {
    reader: Effect;
    search: Effect;
  };
  reducers: {
    saveHotel: Reducer<EarnHotelModelState>;
  };
}

const EarnHotelModel: EarnHotelModelType = {
  namespace: 'earnHotel',

  state: {
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *reader(action, effects) {
      yield taker.reader('/earn/hotel', action, effects, reader, 'saveHotel');
    },
    *search(action, effects) {
      yield taker.search('earn/hotel', action, effects, search, 'saveHotel');
    },
  },

  reducers: {
    saveHotel(state, action) {
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

export default EarnHotelModel;

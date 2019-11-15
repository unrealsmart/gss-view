import { Effect } from 'dva';
import { Reducer } from 'redux';
import { search, update } from '@/services/common';
import { TE, TR } from '@/utils/taker';

const REQUEST_URL = '/earn/hotel';
const { run } = TR;

export interface EarnHotelModelItem {
  id: number;
  code: string;
  hotel_id: number | string;
  name_cn: string;
  name_en: string;
  address_cn: string;
  address_en: string;
  advantage: number | string;
  request_status?: number | string;
}

export interface EarnHotelModelState extends GlobalDefaultModelState {
  info?: EarnHotelModelItem | object;
}

export interface EarnHotelModelType {
  namespace: 'earnHotel';
  state: EarnHotelModelState;
  effects: {
    update: Effect;
    search: Effect;
  };
  reducers: {
    run: Reducer<EarnHotelModelState>;
  };
}

const EarnHotelModel: EarnHotelModelType = {
  namespace: 'earnHotel',

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *search(action, effects) {
      yield TE.search(REQUEST_URL, action, effects, search);
    },
    *update(action, effects) {
      yield TE.update(REQUEST_URL, action, effects, update);
    },
  },

  reducers: {
    run,
  },
};

export default EarnHotelModel;

import { Effect } from 'dva';
import { Reducer } from 'redux';
import { TakeEffects, TakeReducers } from '@/utils/take';

const url = '/earn/hotel';

export interface EarnHotelModelItem {
  id: number;
  code: string;
  hotel_id: number | string;
  name_cn: string;
  name_en: string;
  address_cn: string;
  address_en: string;
  advantage: number | string;
  [key: string]: any;
}

export interface EarnHotelModelState extends GlobalModelState {
  info: EarnHotelModelItem | object;
}

export interface EarnHotelModelType {
  namespace: 'earnHotel';
  state: EarnHotelModelState;
  effects: {
    update: Effect;
    search: Effect;
  };
  reducers: {
    [key: string]: Reducer<EarnHotelModelState>;
  };
}

const EarnHotelModel: EarnHotelModelType = {
  namespace: 'earnHotel',

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
    *update(action, effects) {
      yield TakeEffects(url, action, effects);
    },
  },

  reducers: {
    TakeReducers,
  },
};

export default EarnHotelModel;

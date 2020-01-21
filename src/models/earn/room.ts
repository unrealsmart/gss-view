import { Effect } from 'dva';
import { Reducer } from 'redux';
import { TakeEffects, TakeReducers } from '@/utils/take';

const url = '/earn/room';

export interface EarnRoomModelItem {
  id: number;
  code: string;
  city_id: number | string;
  hotel_id: number | string;
  room_id: number | string;
  name_cn: string;
  name_en: string;
  price_change_reminder?: number | string;
  request_status?: number | string;
}

export interface EarnRoomModelState extends GlobalModelState {
  info: EarnRoomModelItem | object;
}

export interface EarnRoomModelType {
  namespace: 'earnRoom';
  state: EarnRoomModelState;
  effects: {
    update: Effect;
    search: Effect;
  };
  reducers: {
    [key: string]: Reducer<EarnRoomModelState>;
  };
}

const EarnRoomModel: EarnRoomModelType = {
  namespace: 'earnRoom',

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

export default EarnRoomModel;

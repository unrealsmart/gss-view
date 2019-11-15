import { Effect } from 'dva';
import { Reducer } from 'redux';
import { search, update } from '@/services/common';
import { TE, TR } from '@/utils/taker';

const REQUEST_URL = '/earn/room';
const { run } = TR;

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

export interface EarnRoomModelState extends GlobalDefaultModelState {
  info?: EarnRoomModelItem | object;
}

export interface EarnRoomModelType {
  namespace: 'earnRoom';
  state: EarnRoomModelState;
  effects: {
    update: Effect;
    search: Effect;
  };
  reducers: {
    run: Reducer<EarnRoomModelState>;
  };
}

const EarnRoomModel: EarnRoomModelType = {
  namespace: 'earnRoom',

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

export default EarnRoomModel;

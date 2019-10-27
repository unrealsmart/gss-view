import { Reducer } from 'redux';

export interface HotelDetailTypes {
  id: number;
}

export interface HotelModelState {
  current?: number | 1;
  pageSize?: number | 20;
  lastPage?: number | null;
  total?: number | null;
  data?: [];
  detail?: HotelDetailTypes | object;
}

export interface HotelModelTypes {
  namespace: 'order';
  state: HotelModelState;
  effects: {
    // search: Effect;
  };
  reducers: {
    save: Reducer<HotelModelState>;
  };
}

const HotelModel: HotelModelTypes = {
  namespace: 'order',

  state: {
    current: 1,
    pageSize: 20,
    lastPage: null,
    total: null,
    data: [],
    detail: {},
  },

  effects: {},

  reducers: {
    save(state, action) {
      if (action.payload.detail) {
        return {
          ...state,
          detail: action.payload.detail,
        };
      }
      return {
        ...state,
        current: action.payload.current_page,
        pageSize: action.payload.per_page,
        lastPage: action.payload.last_page,
        total: action.payload.total,
        data: action.payload.data,
      };
    },
  },
};

export default HotelModel;

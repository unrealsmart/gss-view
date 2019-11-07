import { Effect } from 'dva';
import { Reducer } from 'redux';
import { reader, search, update } from '@/services/common';
import { TE, TR } from '@/utils/taker';

const REQUEST_URL = '/eran/hotel';
const REDUCER_NAME = 'saveHotel';

export interface DefaultModelItem {
}

export interface DefaultModelType {
  namespace: 'default';
  state: GlobalDefaultModelState;
  effects: {
    reader: Effect;
    update: Effect;
    search: Effect;
  };
  reducers: {
    [key: string]: Reducer<GlobalDefaultModelState>;
  };
}

const DefaultModel: DefaultModelType = {
  namespace: 'default',

  state: {
    page: {},
    list: [],
    info: {},
  },

  effects: {
    *reader(action, effects) {
      yield TE.reader(REQUEST_URL, action, effects, reader, REDUCER_NAME);
    },
    *update(action, effects) {
      yield TE.update(REQUEST_URL, action, effects, update, REDUCER_NAME);
    },
    *search(action, effects) {
      yield TE.search(REQUEST_URL, action, effects, search, REDUCER_NAME);
    },
  },

  reducers: {
    ...TR.run,
    // saveHotel(state, action) {
    //   return TR.run(state, action);
    // },
  },
};

export default DefaultModel;

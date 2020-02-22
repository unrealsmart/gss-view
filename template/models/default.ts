import { Effect } from 'dva';
import { AnyAction, Reducer } from 'redux';
import { structure } from '@/utils/utils';

export interface ModelType {
  namespace: string;
  state: GlobalModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: Reducer<GlobalModelState, AnyAction>;
  };
}

const DefaultModel: ModelType = {
  namespace: 'default',

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
  },

  effects: {
    // *create(action, effects) {
    //   //
    // },
    // *remove(action, effects) {
    //   //
    // },
    // *update(action, effects) {
    //   //
    // },
    // *search(action, effects) {
    //   //
    // },
    // *detail(action, effects) {
    //   //
    // },
  },

  reducers: {
    save: (state, action) => structure(state, action),
  },
};

export default DefaultModel;

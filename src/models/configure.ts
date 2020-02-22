import { Effect } from 'dva';
import { Reducer } from 'redux';
import { structure } from '@/utils/utils';

export interface ConfigureModelType {
  namespace: string;
  state: GlobalModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: Reducer<GlobalModelState>;
  };
}

const ConfigureModel: ConfigureModelType = {
  namespace: 'configure',

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

export default ConfigureModel;

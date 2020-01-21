import { Effect } from 'dva';
import { Reducer } from 'redux';
import { TakeEffects, TakeReducers } from '@/utils/take';

const url = '/main/module';
const namespace = 'module';

export interface ModuleModelType {
  namespace: string;
  state: GlobalModelState;
  effects: {
    create: Effect;
    remove: Effect;
    update: Effect;
    search: Effect;
    detail: Effect;
  };
  reducers: {
    [key: string]: Reducer<GlobalModelState>;
  };
}

const ModuleModel: ModuleModelType = {
  namespace,

  state: {
    args: {},
    page: {},
    list: [],
    info: {},
    requesting: false,
  },

  effects: {
    *create(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *remove(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *update(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *search(action, effects) {
      yield TakeEffects(url, action, effects);
    },
    *detail(action, effects) {
      yield TakeEffects(url, action, effects);
    },
  },

  reducers: {
    TakeReducers,
  },
};

export default ModuleModel;

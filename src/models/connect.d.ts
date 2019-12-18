import { AnyAction } from 'redux';
import { MenuDataItem } from '@ant-design/pro-layout';
import { RouterTypes } from 'umi';
import { GlobalModelState } from './global';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { UserModelState } from './user';
import { StateType } from './login';
import { EarnHotelModelState } from '@/models/earn/hotel';
import { EarnTaskModelState } from '@/models/earn/task';
import { AdministratorModelState } from '@/models/system/administrator';
import { DomainModelState } from '@/models/system/domain';
import { WOWGModelState } from '@/models/tools/wowg';

export { GlobalModelState, SettingModelState, UserModelState };

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: SettingModelState;
  user: UserModelState;
  login: StateType;
  // administrator
  administrator: AdministratorModelState;
  domain: DomainModelState;
  // tools: earn
  earnHotel: EarnHotelModelState;
  earnTask: EarnTaskModelState;
  // tools: WOWG
  wowg: WOWGModelState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}

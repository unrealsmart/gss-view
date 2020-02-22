declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'is-json';
declare module 'js-base64';
declare module 'symbol-tree';
declare module '@antv/data-set';

// google analytics interface
interface GAFieldsObject {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  nonInteraction?: boolean;
}
interface Window {
  ga: (
    command: 'send',
    hitType: 'event' | 'pageview',
    fieldsObject: GAFieldsObject | string,
  ) => void;
  reloadAuthorized: () => void;
  g_app: {
    _store: {
      dispatch?: any;
      [key: string]: any;
    };
    [key: string]: any;
  };
  rc: {
    [key: string]: any;
  };
}

declare let ga: Function;

// preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined;

// global interface json web token type
interface JsonWebTokenType {
  ADP_LOGOUT?: boolean;
  message?: string;
  token?: string;
}

// global interface casbin auth model type
interface AuthModelType {
  sub?: string;
  dom?: string;
  obj?: string;
  act?: string;
  des?: string;
}

// global interface model
interface GlobalModelState {
  args: object;
  page:
    | object
    | {
        current: number | 1;
        size: number | 20;
        last: number | 0;
        total: number | 0;
      };
  list: [];
  info: object | [];
}

// global index class state
interface GlobalClassState {
  // 数据加载状态
  dataLoading?: boolean;
  // more state any
  [key: string]: any;
}

// global form class state
interface GlobalFormState {
  // 表单加载状态
  formLoading?: boolean;
  // 表单项禁用
  formItemDisable?: boolean;
  // 提交按钮状态
  submitLoading?: boolean;
  // 提交按钮禁用
  submitDisable?: boolean;
  // 返回按钮禁用
  returnDisable?: boolean;
  // more state any
  [key: string]: any;
}

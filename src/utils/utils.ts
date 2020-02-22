import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { ComponentProps } from 'react';
import tree from '@/utils/tree';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) ||
      (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

/**
 * 全屏加载进场、出场
 */
export function fullScreenLoading(action: 'appear' | 'leave') {
  const elementLoading = document.getElementById('loading');
  if (elementLoading) {
    if (action === 'appear') elementLoading.classList.remove('leave');
    if (action === 'leave') elementLoading.classList.add('leave');
  }
}

// 请求代理
export function ra(
  that: ComponentProps<any>,
  type: string,
  payload?: object | object[],
  callback?: Function,
): any {
  // 设置数据加载状态（仅在搜索时自动设置）
  const typeArray = type.split('/');
  if (typeArray[typeArray.length - 1] === 'search') {
    that.setState({ dataLoading: true });
  }

  // 判断调用函数是否正常
  const { dispatch } = that.props;
  if (!dispatch) {
    console.error('dispatch is undefined');
    return undefined;
  }
  // 发送调用请求
  // const { createMode = 'push', ...newPayload }: any = payload;
  const response = dispatch({ type, payload });
  // 处理请求异常
  if (!response || !response.then) {
    console.warn('response or response then is undefined');
    that.setState({ dataLoading: false });
    return undefined;
  }
  // 请求结束，设置加载状态
  response.finally(() => {
    that.setState({ dataLoading: false });
  });
  response.then((data: any) => {
    if (callback) callback(data);
  });
  return response;
}

// 结构化响应数据
export function structure(state: any, action: any) {
  const { mode = undefined, createMode = 'push' } = action;

  // 正确的响应结果不应该是 Response，此时不更新任何值
  if (action.payload instanceof Response) {
    return state;
  }

  // 搜索
  if (mode === 'search') {
    const { total, per_page: pageSize = 20, current_page: current, data } = action.payload;
    return {
      ...state,
      args: action.args || { page: 1, page_size: 10 },
      page: current ? { current, pageSize, total } : {},
      list: tree.initialize(data || action.payload),
    };
  }
  // 添加
  if (mode === 'create') {
    return {
      ...state,
      list: tree.insert(state.list, action.payload, createMode),
    };
  }
  // 更新
  if (mode === 'update') {
    return {
      ...state,
      list: tree.update(state.list, action.payload),
    };
  }
  // 详情
  if (mode === 'detail') {
    return {
      ...state,
      info: action.payload,
    };
  }
  // 移除
  if (mode === 'remove') {
    return {
      ...state,
      list: tree.remove(state.list, action.payload),
    };
  }

  // 默认不更新任何值
  return state;
}

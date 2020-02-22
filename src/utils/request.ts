/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { message } from 'antd';
import isJSON from 'is-json';
import { setToken, getToken, setCurrentUser } from '@/utils/storage';
import router from 'umi/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const url = new URL(response.url);
    if (response.status >= 400) {
      router.push(`/exception/${response.status}`);
    }
    response
      .clone()
      .text()
      .then(data => {
        const object = isJSON(data) ? JSON.parse(data) : {};
        if (url.pathname !== '/ss/main/config/adp') {
          message.error(`${response.status} ${object.message || errorText}`);
        }
      });
  } else if (!response) {
    message.error('您的网络发生异常，无法连接服务器', 0);
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

/**
 * 配置request拦截器
 */
request.interceptors.request.use((url, options) => {
  const newUrl = url.charAt(0) === '/' || /(http|https):\/\//.test(url) ? url : `/ss/${url}`;
  const adpToken = getToken();
  const newHeaders = adpToken
    ? {
        ...options.headers,
        Authorization: `Bearer ${adpToken}`,
      }
    : options.headers;

  return {
    url: newUrl,
    options: {
      ...options,
      headers: newHeaders,
    },
  };
});

/**
 * 配置response拦截器（仅处理正确的响应内容）
 */
request.interceptors.response.use(response => {
  const rc = response.clone();
  // 获取 Header 中的 Token、Authorization、Action，用于更新本地存储：adp-token、adp-user、adp-action
  const rcToken = rc.headers.get('adp-token');
  const rcUser = rc.headers.get('adp-user');
  const rcAction = rc.headers.get('adp-action');

  if (rcToken) setToken(rcToken);
  if (rcUser) setCurrentUser(rcUser);

  // 正常情况下，基本不可能会执行到此处，不过在某些特殊场景可能需要向客户端发送退出程序。
  /* eslint no-underscore-dangle: 0 */
  const store = window.g_app._store;
  if (rcAction === 'LOGOUT' && store) {
    store.dispatch({ type: 'login/logout' });
  }

  return response;
});

export default request;

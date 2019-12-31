import { ComponentProps } from 'react';

/**
 * todo 未使用
 * 根据预定义的调用模式更新附加状态
 * 操作     更新值     方式
 * search   list,page fetch
 * create   list      inc
 * update   list      change
 * delete   list      dec
 * detail   info      change
 */

export default (
  that: ComponentProps<any>,
  type: string,
  payload: object | object[] = {},
  callback?: Function,
): void => {
  // const [namespace, actionName]: string[] = type.split('/');
  // console.log(namespace);
  // console.log(actionName);

  // 执行前需更新状态，防止重复执行
  that.setState({
    dataLoading: true,
  });

  const { dispatch } = that.props;
  if (!dispatch) {
    console.warn('NOT REQUEST.');
  }
  const response = dispatch({ type, payload });
  if (!response.then) {
    console.warn('REQUEST FAIL.');
  }

  response.finally(() => {
    that.setState({
      dataLoading: false,
    });
    if (callback) callback();
  });
};

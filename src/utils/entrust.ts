import { ComponentProps } from 'react';

// // 开始请求
// function start() {
//   // 打开数据加载状态
//   // 确认实际调用函数
//   // 发送实际调用请求
//   // 关闭数据加载状态 & 返回异步请求函数
// }
//
// // 前置条件
// function prepose() {
//   //
// }
//
// // 顺序执行
// function sequential() {
//   //
// }
//
// // 并行执行
// function concurrent() {
//   //
// }

export function ra(that: ComponentProps<any>, type: string, payload?: object): any {
  console.log(that);
  console.log(type);
  console.log(payload);
}

export function prepose() {
  //
}

export function sequential() {
  //
}

export function concurrent() {
  //
}

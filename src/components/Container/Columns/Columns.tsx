import React, { Component } from 'react';
import ID from './ID';
import Name from './Name';
import Title from './Title';
import Description from './Description';
import DateTime from './DateTime';
import Status from './Status';
import Actions from './Actions';

interface ColumnsProps {
  //
}

interface ColumnsState {
  signals: any;
  subComponents: any;
}

class Columns extends Component<ColumnsProps, ColumnsState> {
  // 显示数据ID
  static ID: typeof ID;

  // 显示数据名称
  static Name: typeof Name;

  // 显示数据标题
  static Title: typeof Title;

  // 显示数据描述
  static Description: typeof Description;

  // 显示数据日期（默认显示创建日期 + 更新日期，双行显示，可以配置为创建日期、更新日期、自定义日期）
  static DateTime: typeof DateTime;

  // 显示数据状态（默认为可切换 0 / 1 或 false / true 的 Switch 组件，通过 contrasts 可配置 DownDrop +
  // Menu 组件，用来显示和切换多个状态）
  static Status: typeof Status;

  // 操作
  static Actions: typeof Actions;

  state = {
    signals: {},
    subComponents: {},
  };

  componentDidMount(): void {
    const { signals } = this.state;
    const subComponents = this.parseSubComponents();
    // 确保更新时顺序正确
    Object.keys(subComponents).forEach(key => {
      signals[key] = subComponents[key].props;
    });
    // 触发父级组件更新
    const { setColumns }: any = this.props;
    if (setColumns) {
      setColumns(signals);
    }
    this.setState({
      subComponents,
      signals,
    });
  }

  // 解析子组件
  parseSubComponents = (): any => {
    const subComponents = {};
    const { children }: any = this.props;
    React.Children.forEach(children, (child: any) => {
      subComponents[child.type.name] = child;
    });
    return subComponents;
  };

  // 自动载入子组件更新
  autoLoadSubComponent = () => {
    const elements: any = [];
    const { subComponents, signals } = this.state;
    Object.keys(subComponents).forEach(key => {
      const newProps: any = signals[key] || {};
      elements.push(
        subComponents[key] &&
          React.cloneElement(subComponents[key], {
            ...newProps,
            key,
            change: this.change,
          }),
      );
    });
    return elements;
  };

  // 子组件更新动态内容（是否更新是由子组件决定，此函数仅触发更新动作）
  // 📑 重要：子组件内未进行更新检测时会导致无限循环，小心使用
  change = (name: string, values: any) => {
    const { setColumns }: any = this.props;
    const { subComponents, signals } = this.state;
    const component = subComponents[name];
    signals[name] = component ? { ...component.props, ...values } : {};
    this.setState({ signals });
    if (setColumns) {
      setColumns(signals);
    }
  };

  render(): React.ReactNode {
    return <>{this.autoLoadSubComponent()}</>;
  }
}

export default Columns;

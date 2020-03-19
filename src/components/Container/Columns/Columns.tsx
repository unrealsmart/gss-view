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
    const subComponents = this.parseSubComponents();
    const { signals } =  this.state;
    Object.keys(subComponents).forEach(key => {
      signals[key] = subComponents[key].props;
    });
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

  // 显示子组件
  showSubComponent = (children: any) => {
    const { signals } = this.state;
    const newProps: any = signals[children.type.name] || {};
    return children && React.cloneElement(children, {
      ...newProps,
      change: this.change,
    });
  };

  //
  change = (name: string, values: any) => {
    const { subComponents } = this.state;
    const component = subComponents[name];
    const keys = Object.keys(values);
    const isChange = keys.filter(key => component && component.props[key] !== values[key]).length;
    if (isChange) {
      const { signals } = this.state;
      const newSignals = {
        ...signals,
        [name]: { ...component.props, ...values },
      };
      this.setState({ signals: newSignals });
      const { setColumns }: any = this.props;
      if (setColumns) setColumns(Object.values(newSignals));
    }
  };

  render(): React.ReactNode {
    const { ID, Name, Actions } = this.parseSubComponents();
    // console.log(this.state);

    return (
      <div>
        The Component Container Not Show!
        {this.showSubComponent(ID)}
        {this.showSubComponent(Name)}
        {this.showSubComponent(Actions)}
      </div>
    );
  }
}

export default Columns;

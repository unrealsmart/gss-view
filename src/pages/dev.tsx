import React, { Component } from 'react';
import { connect } from 'dva';

interface IndexProps {
  [key: string]: any;
}

interface IndexState extends GlobalClassState {
  //
}

class Index extends Component<IndexProps, IndexState> {
  state = {
    //
  };

  componentDidMount(): void {
    // const { dev } = this.props;
    // console.log(dev);
  }

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  render(): React.ReactNode {
    return (
      <div style={{ margin: 64 }}>
        <div style={{ fontSize: 16 }}>
          <p style={{ fontSize: 18, fontWeight: 'bold' }}>如何在空白的页面上进行开发？</p>
          <p>
            有些页面你可能不需要我们提供的布局，而是一个全新的空白的页面，从而完全发挥你的灵感。
          </p>
          <p>
            它实现起来非常的简单，你只需要在路由上稍加修改，就可以完成此项工作，在路由层级上我们提供了具有权限检查和完全开放的两种路由模式。
          </p>
          <p>未完待续...</p>
        </div>
      </div>
    );
  }
}

export default connect(() => ({
  // class model item
}))(Index);

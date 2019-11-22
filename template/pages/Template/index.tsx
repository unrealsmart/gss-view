import React, { Component } from 'react';
import { connect } from 'dva';

interface IndexProps {
  [key: string]: any;
}

interface IndexState extends GlobalIndexClassState {
  //
}

class Index extends Component<IndexProps, IndexState> {
  state = {};

  componentDidMount(): void {
    // 使用rs工具请求数据
  }

  render(): React.ReactNode {
    return <div>空页面</div>;
  }
}

export default connect(() => ({
  // class model item
}))(Index);

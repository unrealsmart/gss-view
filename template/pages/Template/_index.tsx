import React, { Component } from 'react';
import { connect } from 'dva';

interface IndexProps {
  [key: string]: any;
}

interface IndexState extends GlobalIndexClassState {
  //
}

class _index extends Component<IndexProps, IndexState> {
  state = {};

  componentDidMount(): void {
    // 使用rs工具请求数据
  }

  render(): React.ReactNode | undefined {
    return undefined;
  }
}

export default connect(() => ({
  // class model item
}))(_index);

import React, { Component } from 'react';
import { connect } from 'dva';

interface IndexProps {
  [key: string]: any;
}

interface IndexState extends GlobalClassState {
  //
}

class Index extends Component<IndexProps, IndexState> {
  state = {};

  componentDidMount(): void {}

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  render(): React.ReactNode {
    return (
      <div>
        空页面
      </div>
    );
  }
}

export default connect((
  //
) => ({
  //
}))(Index);

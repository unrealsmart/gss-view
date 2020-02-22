import React, { Component } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';

interface Props {
  [key: string]: any;
}

interface State extends GlobalClassState {
  //
}

class Index extends Component<Props, State> {
  state = {};

  componentDidMount(): void {}

  componentWillUnmount(): void {
    this.setState = () => {};
  }

  render(): React.ReactNode {
    return <div>空页面</div>;
  }
}

export default connect(({ domain }: ConnectState) => ({
  domain,
}))(Index);

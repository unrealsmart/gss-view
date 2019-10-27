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
    //
  }

  render(): React.ReactNode | undefined {
    return undefined;
  }
}

export default connect(() => ({
  // class model item
}))(Index);

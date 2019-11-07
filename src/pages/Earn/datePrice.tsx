import React, { Component } from 'react';
import { connect } from 'dva';
import rs from '@/utils/rs';

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
    rs.reader(this, '')
  }

  render(): React.ReactNode | undefined {
    return undefined;
  }
}

export default connect(() => ({
  // class model item
}))(Index);

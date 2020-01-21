import React, { Component } from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

interface FilterProps {
  disabled?: boolean;
  [key: string]: any;
}

interface FilterState extends GlobalClassState {
  //
}

class Filter extends Component<FilterProps, FilterState> {
  state = {};

  componentDidMount(): void {}

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  render(): React.ReactNode {
    const { disabled } = this.props;
    return <Button icon="filter" disabled={disabled} />;
  }
}

export default connect(() => ({
  // class model item
}))(Filter);

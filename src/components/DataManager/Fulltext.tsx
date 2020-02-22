import React, { Component } from 'react';
import { Input } from 'antd';

interface FulltextProps {
  onSearch: (value: string, event?: any) => void;
  [key: string]: any;
}

interface FulltextState extends GlobalClassState {
  disabled?: boolean;
}

class Fulltext extends Component<FulltextProps, FulltextState> {
  state = {};

  componentDidMount(): void {
    //
  }

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  render(): React.ReactNode {
    const { disabled } = this.props;

    return (
      <Input.Search
        style={{ width: 268 }}
        allowClear
        addonBefore={<span>全文搜索</span>}
        disabled={disabled}
        placeholder="请输入搜索内容"
        onSearch={this.props.onSearch}
      />
    );
  }
}

export default Fulltext;

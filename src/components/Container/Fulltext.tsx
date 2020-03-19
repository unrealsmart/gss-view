import React, { Component } from 'react';
import { Input } from 'antd';

interface FulltextProps {
  disabled?: boolean;
  modalType: string;
  fieldName?: string;
  search?: Function;
}

class Fulltext extends Component<FulltextProps> {
  static defaultProps = {
    disabled: false,
    fieldName: 'fs',
  };

  state = {
    //
  };

  search = (value: string) => {
    const { search } = this.props;
    if (search && typeof search === 'function') {
      search(value);
    }
  };

  render(): React.ReactNode {
    const { disabled } = this.props;

    return (
      <Input.Search
        style={{ width: 268 }}
        allowClear
        addonBefore={<span>全文搜索</span>}
        disabled={disabled}
        placeholder="请输入搜索内容"
        onSearch={this.search}
      />
    );
  }
}

export default Fulltext;

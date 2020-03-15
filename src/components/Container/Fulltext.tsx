import React, { Component } from 'react';
import { Input } from 'antd';

interface FulltextProps {
  disabled?: boolean;
}

class Fulltext extends Component<FulltextProps> {
  state = {
    //
  };

  onFinish = () => {
    //
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
      />
    );
  }
}

export default Fulltext;

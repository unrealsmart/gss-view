import React, { Component } from 'react';
import { connect } from 'dva';
import rs from '@/utils/rs';
import { Button } from 'antd';

interface IndexProps {
  [key: string]: any;
}

interface IndexState extends GlobalClassState {
  //
}

class Index extends Component<IndexProps, IndexState> {
  state = {
    //
  };

  componentDidMount(): void {
    // const { dev } = this.props;
    // console.log(dev);
  }

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  render(): React.ReactNode {
    return (
      <div>
        <Button
          style={{ marginRight: 12 }}
          onClick={() => {
            console.log('search');
            rs(this, 'dev/search', {}, () => {
              const { dev } = this.props;
              console.log(dev);
            });
          }}
        >
          搜索
        </Button>
        <Button
          style={{ marginRight: 12 }}
          onClick={() => {
            rs(this, 'dev/create', { id: 1 }, () => {
              const { dev } = this.props;
              console.log(dev);
            });
          }}
        >
          新建
        </Button>
        <Button
          style={{ marginRight: 12 }}
          onClick={() => {
            rs(this, 'dev/update', { id: 1, title: 'UPDATE' }, () => {
              const { dev } = this.props;
              console.log(dev);
            });
          }}
        >
          更新
        </Button>
        <Button
          style={{ marginRight: 12 }}
          onClick={() => {
            rs(this, 'dev/remove', { id: 1 }, () => {
              const { dev } = this.props;
              console.log(dev);
            });
          }}
        >
          删除
        </Button>
      </div>
    );
  }
}

export default connect(({ dev }: any) => ({
  // class model item
  dev,
}))(Index);

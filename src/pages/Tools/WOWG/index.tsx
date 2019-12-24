import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Button, Upload, Icon, Popover, Row, Col, Spin } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload/interface';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { WOWGModelState } from '@/models/tools/wowg';
import rs from '@/utils/rs';

interface IndexProps {
  wowg: WOWGModelState;
  [key: string]: any;
}

interface IndexState extends GlobalIndexClassState {
  importLoading: boolean;
  popoverContentLoading: boolean;
}

class Index extends Component<IndexProps, IndexState> {
  state = {
    importLoading: false,
    popoverContentLoading: false,
  };

  componentDidMount(): void {
    // 使用rs工具请求数据
    rs(this, 'wowg/dateList');
  }

  importBefore = () => {
    this.setState({
      importLoading: true,
    });
    return true;
  };

  importChange = (info: UploadChangeParam) => {
    const { file } = info;
    if (file.status === 'done') {
      this.setState({
        importLoading: false,
      });
    }
  };

  popoverVisibleChange = (visible: boolean) => {
    if (visible) {
      this.setState({
        popoverContentLoading: true,
      });
      rs(this, 'wowg/dateList', {}, () => {
        this.setState({
          popoverContentLoading: false,
        });
      });
    }
  };

  render(): React.ReactNode {
    const { wowg } = this.props;
    const { importLoading, popoverContentLoading } = this.state;

    const popoverContent = (
      <div className={styles.popoverContentContainer}>
        <Spin spinning={popoverContentLoading}>
          <Row gutter={12} type="flex">
            {wowg.dateList &&
              wowg.dateList.map(item => (
                <Col key={item.id.toString()} span={12}>
                  <a
                    href={`/tools/wow-gold/export/${item.id}`}
                    className={styles.popoverContentItem}
                  >
                    {item.collect_time}
                  </a>
                </Col>
              ))}
          </Row>
        </Spin>
      </div>
    );

    return (
      <div>
        <Card bordered={false} style={{ marginBottom: 24 }}>
          统计
        </Card>
        <Card bordered={false} style={{ height: 300 }}>
          图表
          <div className={styles.floatContainer}>
            <Upload
              action="/tools/wow-gold/import"
              showUploadList={false}
              beforeUpload={this.importBefore}
              onChange={this.importChange}
              multiple
            >
              <Button type="primary" icon="import" loading={importLoading}>
                导入
              </Button>
            </Upload>
            <Icon type="small-dash" style={{ fontSize: 32, color: '#ccc' }} />
            <Popover
              content={popoverContent}
              placement="bottom"
              onVisibleChange={this.popoverVisibleChange}
            >
              <Button icon="export" target="_blank">
                导出
              </Button>
            </Popover>
          </div>
        </Card>
      </div>
    );
  }
}

export default connect(({ wowg }: ConnectState) => ({
  // class model item
  wowg,
}))(Index);

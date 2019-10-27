import React, { Component } from 'react';
import { Card, Col, Icon, Modal, Progress, Row, Spin, Typography } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import BizForm from './form';
import styles from './index.less';
import { EarnTaskModelItem } from '@/models/earn/task';

const { Text } = Typography;
// const TaskIconTypes = ['caret-right', 'dash', 'pause'];

interface TaskIndexProps {
  [key: string]: any;
}

interface TaskIndexState extends GlobalIndexClassState {
  modalVisible: boolean;
  taskPercent: number | 0;
}

class TaskIndex extends Component<TaskIndexProps, TaskIndexState> {
  state = {
    dataLoading: true,
    modalVisible: false,
    taskPercent: 0,
  };

  componentDidMount(): void {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'earnTask/reader',
      }).then(() => {
        if (this.state.dataLoading) {
          this.setState({
            dataLoading: false,
          });
        }
      });
    }
  }

  showModal = (): void => {
    this.setState({
      modalVisible: true,
    });
  };

  hideModal = (): void => {
    this.setState({
      modalVisible: false,
    });
  };

  taskControl = (item: EarnTaskModelItem): void => {
    console.log(item);
  };

  render(): React.ReactNode {
    const { dataLoading, modalVisible, taskPercent } = this.state;
    const { earnTask } = this.props;

    const Play = <Icon type="" style={{ fontSize: 24, color: '#999' }} />;

    return (
      <PageHeaderWrapper>
        <Card bordered={false} style={{ marginBottom: 24 }}>
          采集任务按照
          <Text strong style={{ margin: '0 2px' }}>
            国家/城市
          </Text>
          为单位运行
        </Card>
        <Spin spinning={dataLoading}>
          <Row gutter={16}>
            {earnTask.list
              ? earnTask.list.map((item: EarnTaskModelItem) => (
                  <Col span={8} key={item.id.toString()}>
                    <Card bordered={false} style={{ marginBottom: 24, height: 230 }}>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 'bold',
                          marginBottom: 12,
                          textAlign: 'center',
                        }}
                      >
                        {item.country_name} {item.city_name}
                      </div>
                      <Row gutter={12} type="flex" justify="center" style={{ marginBottom: 12 }}>
                        <Col span={10} style={{ textAlign: 'center' }}>
                          <div style={{ letterSpacing: 1.5, marginBottom: 6 }}>入住</div>
                          <div style={{ fontSize: 15 }}>{item.check_in_date}</div>
                        </Col>
                        <Col
                          span={4}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon type="line" />
                        </Col>
                        <Col span={10} style={{ textAlign: 'center' }}>
                          <div style={{ letterSpacing: 1.5, marginBottom: 6 }}>离店</div>
                          <div style={{ fontSize: 15 }}>{item.check_out_date}</div>
                        </Col>
                      </Row>
                      <Row type="flex" justify="center">
                        <Col className={styles.progress} onClick={() => this.taskControl(item)}>
                          <Progress
                            type="circle"
                            strokeColor={{ '0%': '#ccc', '100%': '#87d068' }}
                            percent={taskPercent}
                            width={90}
                            strokeLinecap="square"
                            format={percent => (
                              <div style={{ fontSize: 12 }}>
                                {Play} {percent}
                              </div>
                            )}
                          />
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                ))
              : undefined}
            <Col span={8}>
              <Card bordered={false} className={styles.addItemStyle} onClick={this.showModal}>
                <Icon type="plus" style={{ fontSize: 36, color: '#aaa' }} />
              </Card>
              <Modal title="新建任务" visible={modalVisible} onCancel={this.hideModal}>
                <BizForm />
              </Modal>
            </Col>
          </Row>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ earnTask }: ConnectState) => ({
  earnTask,
}))(TaskIndex);

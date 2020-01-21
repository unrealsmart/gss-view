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

interface TaskIndexState extends GlobalClassState {
  modalVisible: boolean;
  crawlTaskInterval: NodeJS.Timer | undefined;
  locking: number | string | undefined;
}

class TaskIndex extends Component<TaskIndexProps, TaskIndexState> {
  state = {
    dataLoading: true,
    modalVisible: false,
    crawlTaskInterval: undefined,
    locking: undefined,
  };

  componentDidMount(): void {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'earnTask/reader',
      }).then(() => {
        const { earnTask } = this.props;
        if (earnTask.list) {
          earnTask.list.map((item: EarnTaskModelItem) => {
            if (item.task.thread_status) {
              this.taskControl(item);
              this.setState({
                locking: item.id,
              });
            }
            return item;
          });
        }
        if (this.state.dataLoading) {
          this.setState({
            dataLoading: false,
          });
        }
      });
    }
  }

  componentWillUnmount(): void {
    const { crawlTaskInterval } = this.state;
    clearInterval(crawlTaskInterval);
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
    const { dispatch } = this.props;

    const requests = () => {
      if (dispatch) {
        dispatch({
          type: 'earnTask/runCrawlTask',
          payload: {
            id: item.id,
          },
        });
      }
    };

    requests();

    const interval = setInterval(() => {
      requests();
    }, 10 * 1000);
    this.setState({
      crawlTaskInterval: interval,
      locking: item.id,
    });
  };

  render(): React.ReactNode {
    const { dataLoading, modalVisible, locking } = this.state;
    const { earnTask } = this.props;
    const earnTaskList = earnTask.list || [];

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
            {earnTaskList.map((item: EarnTaskModelItem) => (
              <Col span={8} key={item.id.toString()}>
                <Spin
                  indicator={<Icon type="stop" style={{ color: '#f00' }} />}
                  spinning={(locking && item.id !== locking) || false}
                >
                  <Card bordered={false} style={{ marginBottom: 24, height: 260 }}>
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
                          percent={
                            Number((item.task.current / item.task.count).toFixed(2)) * 100
                          }
                          width={90}
                          strokeLinecap="square"
                          format={percent => (
                            <div style={{ fontSize: 12 }}>
                              {item.task.thread_status ? (
                                <div>
                                  <div style={{ marginBottom: 4, fontSize: 15 }}>
                                    {percent}%
                                  </div>
                                  <div>
                                    {item.task.current} / {item.task.count}
                                  </div>
                                </div>
                              ) : (
                                <Icon
                                  type="caret-right"
                                  style={{ fontSize: 18, color: '#999' }}
                                />
                              )}
                            </div>
                          )}
                        />
                      </Col>
                    </Row>
                    <Row
                      type="flex"
                      justify="center"
                      align="middle"
                      style={{ marginBottom: 12 }}
                    >
                      <Col>
                        <div>{item.task.current_hotel}</div>
                      </Col>
                    </Row>
                  </Card>
                </Spin>
              </Col>
            ))}
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

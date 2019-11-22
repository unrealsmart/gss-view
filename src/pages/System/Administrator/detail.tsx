import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Col, Row, Statistic, Icon } from 'antd';
import styles from './detail.less';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import BizIcon from '@/components/BizIcon';
import router from 'umi/router';
import rs from '@/utils/rs';

interface AdministratorDetailProps extends ConnectProps {
  currentUser: CurrentUser;
}

interface AdministratorDetailState {
  tabKey: string;
}

class AdministratorDetail extends Component<AdministratorDetailProps, AdministratorDetailState> {
  state = {
    tabKey: 'mySpace',
  };

  componentDidMount(): void {
    const { query = {} }: any = this.props.location;
    rs.detail(this, 'administrator', query);
  }

  render(): React.ReactNode {
    const { currentUser } = this.props;
    const { tabKey } = this.state;
    const tabList = [
      {
        key: 'mySpace',
        tab: '我的空间',
      },
      {
        key: 'task',
        tab: '任务',
      },
      {
        key: 'setting',
        tab: '设置',
      },
    ];

    return (
      <PageHeaderWrapper onBack={() => router.goBack()}>
        <Card bordered={false} className={styles.container}>
          <div className={styles.topBackground} />
          <Row type="flex" gutter={32}>
            <Col>
              <Avatar size={128} shape="square" src={currentUser.avatar} />
            </Col>
            <Col xs={12} md={6}>
              <div className={styles.username}>{currentUser.username}</div>
              <div className={styles.email}>
                <BizIcon.AliyunOw type="aliyun-ow-icon-test33" style={{ fontSize: 16 }} />
                {currentUser.email ? (
                  <a href={`mailto:${currentUser.email}`}>{currentUser.email}</a>
                ) : (
                  <span>未填写</span>
                )}
              </div>
              <div className={styles.phone}>
                <BizIcon.AliyunOw type="aliyun-ow-icon-test24" style={{ fontSize: 16 }} />
                {currentUser.phone ? (
                  <a href={`tel:${currentUser.phone}`}>{currentUser.phone}</a>
                ) : (
                  <span>未填写</span>
                )}
              </div>
              <div className={styles.address}>
                <BizIcon.AliyunOw type="aliyun-ow-icon-test20" style={{ fontSize: 16 }} />
                <span>{currentUser.address || '未填写'}</span>
              </div>
            </Col>
            <Col xs={24} md={12}>
              <Row type="flex" gutter={64} align="middle" style={{ height: '100%' }}>
                <Col>
                  <Statistic title="已获赞" value={1128} prefix={<Icon type="like" />} />
                </Col>
                <Col>
                  <Statistic title="已发布文章" value={81128} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Card
          bordered={false}
          tabList={tabList}
          activeTabKey={tabKey}
          onTabChange={key => {
            this.setState({
              tabKey: key,
            });
          }}
          className={styles.container}
        >
          info (use card tab for her)
          {tabKey === 'mySpace' && <div>my space</div>}
          {tabKey === 'task' && <div>task</div>}
          {tabKey === 'setting' && <div>setting</div>}
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ user, administrator }: ConnectState) => ({
  currentUser: user.currentUser,
  administrator,
}))(AdministratorDetail);
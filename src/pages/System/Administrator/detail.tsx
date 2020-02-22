import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Avatar, Card, Col, Row, Statistic, Icon, Spin } from 'antd';
import { ConnectProps, ConnectState } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import BizIcon from '@/components/BizIcon';
import router from 'umi/router';
import { ra } from '@/utils/utils';
import { AdministratorModelItem } from '@/models/system/administrator';
import styles from './detail.less';

interface AdministratorDetailProps extends ConnectProps {
  currentUser?: CurrentUser | any;
  detail?: AdministratorModelItem | any;
}

interface AdministratorDetailState extends GlobalClassState {
  tabKey: string;
}

class AdministratorDetail extends Component<AdministratorDetailProps, AdministratorDetailState> {
  static defaultProps = {
    currentUser: {},
    detail: {},
  };

  state = {
    tabKey: 'mySpace',
    dataLoading: false,
  };

  componentDidMount(): void {
    const { query = {} }: any = this.props.location;
    ra(this, 'administrator/detail', query);
  }

  render(): React.ReactNode {
    const { currentUser, detail } = this.props;
    const { tabKey, dataLoading } = this.state;
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
        <Spin spinning={dataLoading}>
          <Card bordered={false} className={styles.container}>
            <div className={styles.topBackground} />
            <Row type="flex" gutter={32}>
              <Col>
                <Avatar
                  size={128}
                  shape="square"
                  src={(detail.avatar && detail.avatar.path) || `/avatar/${detail.id}.jpg`}
                />
              </Col>
              <Col xs={12} md={6}>
                <div className={styles.username}>
                  {detail.username || 'NULL'}
                  {currentUser.username === detail.username && '（当前账户）'}
                </div>
                <div className={styles.email}>
                  <BizIcon.AliyunOw type="aliyun-ow-icon-test33" style={{ fontSize: 16 }} />
                  {detail.email ? (
                    <a href={`mailto:${detail.email}`}>{detail.email}</a>
                  ) : (
                    <span>未填写</span>
                  )}
                </div>
                <div className={styles.phone}>
                  <BizIcon.AliyunOw type="aliyun-ow-icon-test24" style={{ fontSize: 16 }} />
                  {detail.phone ? (
                    <a href={`tel:${detail.phone}`}>{detail.phone}</a>
                  ) : (
                    <span>未填写</span>
                  )}
                </div>
                <div className={styles.address}>
                  <BizIcon.AliyunOw type="aliyun-ow-icon-test20" style={{ fontSize: 16 }} />
                  <span>{detail.address || '未填写'}</span>
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
              this.setState({ tabKey: key });
            }}
            className={styles.container}
          >
            info (use card tab for her)
            {tabKey === 'mySpace' && <div>my space</div>}
            {tabKey === 'task' && <div>task</div>}
            {tabKey === 'setting' && <div>setting</div>}
          </Card>
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ user, administrator }: ConnectState) => ({
  currentUser: user.currentUser,
  detail: administrator.info,
}))(AdministratorDetail);

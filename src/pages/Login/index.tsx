import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Button, Card, Form, Input, Row, Col } from 'antd';
import { SmileOutlined, QqOutlined, GithubOutlined, WeiboOutlined } from '@ant-design/icons/lib';
import { ConnectState } from '@/models/connect';
import { FormProps } from 'antd/lib/form';
import { StateType } from '@/models/login';
import { fullScreenLoading } from '@/utils/utils';
import logo from '@/assets/logo.jpg';
import styles from './index.less';

interface LoginFormComponentProps extends FormProps {
  [key: string]: any;
}

class Login extends Component<LoginFormComponentProps> {
  protected formRef: any = React.createRef();

  state = {
    submitLoading: false,
    visible: false,
  };

  componentDidMount(): void {
    fullScreenLoading('leave');
  }

  finish = (values: any) => {
    this.setState({
      submitLoading: true,
    });
    const { dispatch, login } = this.props;
    dispatch({
      type: 'login/login',
      payload: values,
    }).then(() => {
      const { status }: StateType = login;
      if (!status) {
        this.setState({
          submitLoading: false,
        });
      }
    }).catch(() => {
      this.setState({
        submitLoading: false,
      });
    });
  };

  render() {
    const { submitLoading, visible } = this.state;

    return (
      <div className={styles.local}>
        <Card bordered={false} style={{ width: 390, padding: '0 24px 24px', margin: '0 auto 64px' }}>
          <div className="title">
            <img src={logo} alt="Logo" style={{ height: 75 }} />
          </div>
          {visible && <Alert message="登录失败" type="error" showIcon />}
          {/* local login */}
          <Form
            name="login"
            colon={false}
            ref={this.formRef}
            hideRequiredMark
            onFinish={this.finish}
            layout="vertical"
          >
            <Form.Item
              label="username"
              name="username"
              hasFeedback
              required
              help={false}
              rules={[{ required: true }]}
            >
              <Input
                allowClear
                disabled={submitLoading}
                placeholder="please input username."
              />
            </Form.Item>
            <Form.Item label="password" name="password" hasFeedback required help={false}>
              <Input.Password
                allowClear
                disabled={submitLoading}
                placeholder="please input password."
              />
            </Form.Item>
            <Form.Item>
              <Row justify="space-between" align="middle">
                <Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    ghost
                    style={{ width: 120 }}
                    loading={submitLoading}
                  >
                    Login
                  </Button>
                </Col>
                <Col>
                  <a>忘记密码？</a>
                </Col>
              </Row>
            </Form.Item>
          </Form>
          {/* third login */}
          <div className={styles.third}>
            <div style={{ marginBottom: 12 }}>or, use third party login (dev)</div>
            <div>
              <Button icon={<QqOutlined />} disabled />
              <Button icon={<GithubOutlined />} disabled />
              <Button icon={<WeiboOutlined />} disabled />
              {/*
              <Button icon="wechat" disabled />
              <Button icon="alipay" disabled />
              <Button icon="taobao" disabled />
              <Button icon="google" disabled />
              */}
            </div>
          </div>
          {/* dev pro */}
          <div className={styles.pro}>
            <SmileOutlined style={{ marginRight: 4 }} />
            <span style={{ marginRight: 8 }}>thank you for your use.</span>
            <a href="http://www.baidu.com/" rel="noopener noreferrer" target="_blank">
              click here to view.
            </a>
          </div>
        </Card>
      </div>
    );
  }
}

export default connect(({ login }: ConnectState) => ({
  login,
}))(Login);

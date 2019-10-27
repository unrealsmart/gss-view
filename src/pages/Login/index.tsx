import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Button, Card, Form, Input, Row, Col, Icon, Tooltip } from 'antd';
import styles from './index.less';
import { ConnectState } from '@/models/connect';
import { FormComponentProps } from 'antd/lib/form';
import { StateType } from '@/models/login';

interface LoginFormComponentProps extends FormComponentProps {
  [key: string]: any;
}

@connect(({ login }: ConnectState) => ({
  login,
}))
class Login extends Component<LoginFormComponentProps> {
  state = {
    submitLoading: false,
    visible: false,
  };

  submit = (e: any) => {
    e.preventDefault();

    this.setState({
      submitLoading: true,
    });

    const { form, dispatch } = this.props;
    form.validateFields((errors, values) => {
      if (!errors) {
        dispatch({
          type: 'login/login',
          payload: values,
        }).then(() => {
          const { status }: StateType = this.props.login;
          if (!status) {
            this.setState({
              submitLoading: false,
            });
          }
        });
      } else {
        this.setState({
          submitLoading: false,
        });
      }
    });
  };

  render() {
    // const { form } = this.props;
    const { submitLoading, visible } = this.state;
    const { getFieldDecorator, getFieldError } = this.props.form;

    return (
      <div className={styles.local}>
        <Card bordered={false} style={{ width: 390, padding: 24, margin: '0 auto 64px' }}>
          <div className="title">Login</div>
          {visible && <Alert message="登录失败" type="error" showIcon />}
          {/* local login */}
          <Form colon={false} hideRequiredMark onSubmit={this.submit}>
            <Form.Item label="username" hasFeedback help={false}>
              <Tooltip
                visible={!!getFieldError('username')}
                placement="topRight"
                title={getFieldError('username')}
              >
                {getFieldDecorator('username', {
                  rules: [{ required: true }],
                })(
                  <Input
                    allowClear
                    disabled={submitLoading}
                    placeholder="please input username."
                  />,
                )}
              </Tooltip>
            </Form.Item>
            <Form.Item label="password" hasFeedback help={false}>
              <Tooltip
                visible={!!getFieldError('password')}
                placement="topRight"
                title={getFieldError('password')}
              >
                {getFieldDecorator('password', {
                  rules: [{ required: true }],
                })(
                  <Input.Password
                    allowClear
                    disabled={submitLoading}
                    placeholder="please input password."
                  />,
                )}
              </Tooltip>
            </Form.Item>
            <div>
              {getFieldDecorator('entrance', {
                initialValue: 'main',
                rules: [{ required: true }],
              })(<Input type="hidden" />)}
            </div>
            <Form.Item>
              <Row type="flex" justify="space-between" align="middle">
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
              <Button icon="qq" disabled />
              <Button icon="github" disabled />
              <Button icon="weibo" disabled />
              <Button icon="wechat" disabled />
              <Button icon="alipay" disabled />
              <Button icon="taobao" disabled />
              <Button icon="google" disabled />
            </div>
          </div>
          {/* dev pro */}
          <div className={styles.pro}>
            <Icon type="smile" style={{ marginRight: 4 }} />
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

export default Form.create()(Login);

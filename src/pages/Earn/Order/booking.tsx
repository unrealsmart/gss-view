import React, { Component, ComponentState, FormEvent } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { router } from 'umi';
import { Button, Card, Col, DatePicker, Form, Input, Radio, Row, Spin } from 'antd';
import { FormComponentProps } from 'antd/es/form';

interface AdministratorFormProps extends FormComponentProps, History {
  [key: string]: any;
}

interface AdministratorFormState extends ComponentState {
  confirmDirty?: boolean;
  formLoading?: boolean;
  formItemDisable?: boolean;
  submitLoading?: boolean;
}

class HotelOrderBooking extends Component<AdministratorFormProps, AdministratorFormState> {
  state = {
    formLoading: false,
    formItemDisable: false,
    submitLoading: false,
  };

  componentDidMount(): void {
    const { dispatch, history } = this.props;
    const { location } = history;
    if (location.query.id) {
      this.setState({
        formLoading: true,
      });
      dispatch({
        type: 'administrator/detail',
        payload: location.query,
      }).then(() => {
        const { formLoading } = this.state;
        if (formLoading) {
          this.setState({
            formLoading: false,
          });
        }
      });
    }
  }

  submit = (e: FormEvent): void => {
    e.preventDefault();
    const { dispatch, form, route } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        this.setState({
          formItemDisable: true,
          submitLoading: true,
        });
        delete values.confirm;
        dispatch({
          type: `administrator/${route.name === 'create' ? route.name : 'update'}`,
          payload: {
            ...values,
            avatar: values.avatar[0] && values.avatar[0].response && values.avatar[0].response.id,
            entrance: 'main',
          },
        }).then(() => {
          if (this.state.submitLoading) {
            this.setState({
              submitLoading: false,
              formItemDisable: false,
            });
          }
        });
      }
    });
  };

  render(): React.ReactNode {
    const { form, route, administrator } = this.props;
    const { getFieldDecorator } = form;
    const { formLoading, formItemDisable, submitLoading } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 8 },
        lg: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 10 },
        lg: { span: 8 },
      },
    };

    const detail = route.name === 'editor' ? administrator.detail : {};

    return (
      <PageHeaderWrapper onBack={() => router.goBack()}>
        <Card bordered={false} title={route.name === 'editor' ? '编辑' : '预定'}>
          <Spin spinning={formLoading}>
            <Form {...formItemLayout} onSubmit={this.submit}>
              <Form.Item label="日期">
                {getFieldDecorator('check_date', {
                  initialValue: undefined,
                })(<DatePicker.RangePicker />)}
              </Form.Item>
              <Form.Item label="姓名">
                {getFieldDecorator('name', {
                  initialValue: detail.name || undefined,
                  rules: [
                    {
                      message: '请输入姓名',
                    },
                  ],
                })(<Input allowClear placeholder="请输入姓名" disabled={formItemDisable} />)}
              </Form.Item>
              <Form.Item label="昵称">
                {getFieldDecorator('nickname', {
                  initialValue: detail.nickname || undefined,
                  rules: [
                    {
                      message: '请输入昵称',
                    },
                  ],
                })(<Input allowClear placeholder="请输入昵称" disabled={formItemDisable} />)}
              </Form.Item>
              <Form.Item label="性别">
                {getFieldDecorator('gender', {
                  initialValue: detail.gender || 3,
                })(
                  <Radio.Group disabled={formItemDisable}>
                    <Radio value={1}>男</Radio>
                    <Radio value={2}>女</Radio>
                    <Radio value={3}>保密</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="状态">
                {getFieldDecorator('status', {
                  initialValue: 1,
                })(
                  <Radio.Group disabled={formItemDisable}>
                    <Radio value={1}>正常</Radio>
                    <Radio value={0}>禁用</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {getFieldDecorator('domain', {
                  initialValue: 'main',
                })(<Input disabled={formItemDisable} />)}
              </Form.Item>
              {detail.id ? (
                <Form.Item style={{ display: 'none' }}>
                  {getFieldDecorator('id', {
                    initialValue: detail.id,
                  })(<Input disabled={formItemDisable} />)}
                </Form.Item>
              ) : (
                undefined
              )}

              <Row type="flex" justify="center" gutter={32} style={{ marginBottom: 48 }}>
                <Col>
                  <Button type="primary" htmlType="submit" loading={submitLoading}>
                    {route.name === 'create' ? '提交' : '更新'}
                  </Button>
                </Col>
                <Col>
                  <Button onClick={router.goBack} disabled={formItemDisable}>
                    返回
                  </Button>
                </Col>
              </Row>
            </Form>
          </Spin>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(() => ({}))(Form.create()(HotelOrderBooking));

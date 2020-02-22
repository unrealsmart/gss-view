import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { ConnectState } from '@/models/connect';
import tree from '@/utils/tree';

interface FormProps extends FormComponentProps {
  domain: any;
  role: any;
  value?: any;
}

interface FormState extends GlobalFormState {
  data: any;
}

class BizForm extends Component<FormProps, FormState> {
  state = {
    data: {},
  };

  componentDidMount(): void {
    if (this.props && this.props.value) this.loadData(this.props.value);
  }

  loadData = (data: object) => {
    const { id, domain }: any = data;
    const { role } = this.props;
    this.setState({
      data: {
        domain,
        ...tree.fetch(role.list, id),
      },
    });
  };

  render(): React.ReactNode | undefined {
    const { form, domain } = this.props;
    const { data }: any = this.state;
    const { getFieldDecorator } = form;

    return (
      <Form>
        <Form.Item label="租域">
          {getFieldDecorator('domain', {
            initialValue: data.domain,
            rules: [
              {
                required: true,
                message: '请选择租域',
              },
            ],
          })(
            <Select placeholder="请选择租域" allowClear disabled={!!data.domain}>
              {tree.simple(domain.list).map((item: any) => (
                <Select.Option key={item.key} value={item.value}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            initialValue: data.name,
            rules: [
              {
                required: true,
                message: '请输入名称',
              },
            ],
          })(<Input placeholder="请输入名称" allowClear />)}
        </Form.Item>
        <Form.Item label="标题">
          {getFieldDecorator('title', {
            initialValue: data.title,
            rules: [
              {
                required: true,
                message: '请输入标题',
              },
            ],
          })(<Input placeholder="请输入标题" allowClear />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('description', {
            initialValue: data.description,
            rules: [
              {
                message: '请输入描述',
              },
            ],
          })(
            <Input.TextArea
              allowClear
              autoSize={{ minRows: 4, maxRows: 6 }}
              placeholder="请输入描述"
            />,
          )}
        </Form.Item>
        <Form.Item label="状态">
          {getFieldDecorator('status', {
            initialValue: data.status || 1,
            rules: [
              {
                required: true,
                message: '请选择状态',
              },
            ],
          })(
            <Radio.Group
              options={[
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 },
              ]}
            />,
          )}
        </Form.Item>
        {data.id &&
          getFieldDecorator('id', {
            initialValue: data.id,
            rules: [
              {
                required: true,
              },
            ],
          })(<Input style={{ display: 'none' }} />)}
      </Form>
    );
  }
}

export default connect(({ domain, role }: ConnectState) => ({
  domain,
  role,
}))(Form.create()(BizForm));

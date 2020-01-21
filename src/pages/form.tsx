import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, TreeSelect } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { ConnectState } from '@/models/connect';
import { DomainModelItem } from '@/models/system/domain';
import tree from '@/utils/tree';

interface FormProps extends FormComponentProps {
  domain: DomainModelItem;
  value?: any;
}

interface FormState extends GlobalFormState {
  data?: {
    id?: number | string;
    pid?: number | string;
    name?: string;
    title?: string;
    description?: string;
    status?: number | string;
    create_time?: string;
    update_time?: string;
  };
}

class BizForm extends Component<FormProps, FormState> {
  state = {
    data: {
      id: undefined,
      pid: 0,
      name: undefined,
      title: undefined,
      description: undefined,
      status: undefined,
      create_time: undefined,
      update_time: undefined,
    },
  };

  componentDidMount(): void {
    const { value }: any = this.props;
    if (value) {
      this.loadData(value);
    }
  }

  loadData = (data: object) => {
    const { id }: any = data;
    const { domain } = this.props;
    this.setState({
      data: tree.fetch(domain.list, id),
    });
  };

  // submit = (values: object) => {
  //   console.log(values);
  // };

  render(): React.ReactNode | undefined {
    const { form, domain } = this.props;
    const { data } = this.state;
    const { getFieldDecorator } = form;

    return (
      <Form>
        <Form.Item label="上级">
          {getFieldDecorator('pid', {
            initialValue: data.pid || 0,
            rules: [
              {
                required: true,
                message: '请选择上级域组',
              },
            ],
          })(
            <TreeSelect
              treeData={tree.parent(domain.list)}
              allowClear
              showSearch
              treeNodeFilterProp="title"
              placeholder="请选择上级"
              searchPlaceholder="请输入搜索内容"
            />,
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

export default connect(({ domain }: ConnectState) => ({
  domain,
}))(Form.create()(BizForm));

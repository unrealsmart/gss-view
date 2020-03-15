import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Radio, TreeSelect } from 'antd';
import { FormProps } from 'antd/es/form';
import { ConnectState } from '@/models/connect';
import { AdministratorModelItem } from '@/models/system/administrator';
import tree from '@/utils/tree';
import { DomainModelItem } from '@/models/system/domain';

interface BizFormProps extends FormProps {
  administrator: AdministratorModelItem;
  domain: DomainModelItem;
  value?: any;
}

interface FormState extends GlobalFormState {
  data?: any;
}

class BizForm extends Component<BizFormProps, FormState> {
  state = {
    data: {},
  };

  componentDidMount(): void {
    const { value }: any = this.props;
    if (value) {
      this.loadData(value);
    }
  }

  loadData = (data: object) => {
    const { id }: any = data;
    const { administrator } = this.props;
    this.setState({
      data: tree.fetch(administrator.list, id),
    });
  };

  // submit = (values: object) => {
  //   console.log(values);
  // };

  render(): React.ReactNode | undefined {
    const { domain } = this.props;
    const { data }: any = this.state;
    console.log(data);

    return (
      <Form>
        <Form.Item label="租域">
          <TreeSelect
            treeData={tree.simple(domain.list)}
            allowClear
            showSearch
            treeNodeFilterProp="title"
            placeholder="请选择租域"
            searchPlaceholder="请输入搜索内容"
          />
        </Form.Item>
        <Form.Item label="用户名">
          <Input placeholder="请输入用户名" allowClear />
        </Form.Item>
        <Form.Item label="手机号码">
          <Input placeholder="请输入标题" allowClear />
        </Form.Item>
        <Form.Item label="描述">
          <Input.TextArea
            allowClear
            autoSize={{ minRows: 4, maxRows: 6 }}
            placeholder="请输入描述"
          />
        </Form.Item>
        <Form.Item label="状态">
          <Radio.Group options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]} />
        </Form.Item>
        {/* TODO id hidden */}
      </Form>
    );
  }
}

export default connect(({ domain, administrator }: ConnectState) => ({
  domain,
  administrator,
}))(BizForm);

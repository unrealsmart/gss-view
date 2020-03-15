import React, { Component } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { FormProps } from 'antd/es/form';

type LoadValue = {
  id: number | string;
  [key: string]: any;
};

type LoadData = {
  [key: string]: any;
};

interface FormTemplateProps extends FormProps {
  value?: LoadValue;
}

interface FormState extends GlobalFormState {
  data: {
    [key: string]: any;
  };
}

class BizForm extends Component<FormTemplateProps, FormState> {
  state = {
    data: {},
  };

  // componentDidMount(): void {
  //   if (this.props && this.props.value) this.loadData(this.props.value);
  // }
  //
  // loadData = (value: LoadValue) => {
  //   //
  // };

  render(): React.ReactNode {
    const { data }: LoadData = this.state;
    return (
      <div>
        <div>{data.id}</div>
        biz form
      </div>
    );
  }
}

export default connect(({ domain }: ConnectState) => ({
  domain,
}))(BizForm);

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';

interface FormProps extends FormComponentProps {
  //
}

interface FormState extends GlobalFormState {
  //
}

class BizForm extends Component<FormProps, FormState> {
  state = {};

  render(): React.ReactNode | undefined {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form>
        <Form.Item>
          {getFieldDecorator('name', {
            //
          })(<Input />)}
        </Form.Item>
      </Form>
    );
  }
}

export default connect(() => ({
  //
}))(Form.create()(BizForm));

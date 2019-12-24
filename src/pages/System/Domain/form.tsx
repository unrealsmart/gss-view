import React, { Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';

interface FormProps {
  //
}

interface FormState extends GlobalFormClassState {
  //
}

class BizForm extends Component<FormProps, FormState> {
  state = {};

  submit = (text: string = 'play') => {
    console.log(`${text} + submit`);
  };

  render(): React.ReactNode | undefined {
    return <Form>123</Form>;
  }
}

export default connect(() => ({
  //
}))(Form.create()(BizForm));

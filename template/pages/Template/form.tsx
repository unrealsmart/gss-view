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

  render(): React.ReactNode | undefined {
    return undefined;
  }
}

export default connect(() => ({
  //
}))(Form.create()(BizForm));

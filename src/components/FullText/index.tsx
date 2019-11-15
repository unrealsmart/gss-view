import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import styles from './index.less';
import rs from '@/utils/rs';

interface FullTextProps extends Component, FormComponentProps {
  [key: string]: any;
}

interface FullTextState {
  dataLoading: boolean;
}

class FullText extends Component<FullTextProps, FullTextState> {
  state = {
    dataLoading: false,
  };

  finish = () => {
    this.setState({
      dataLoading: true,
    });
    const { form } = this.props;
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        rs.search(this, 'earnHotel/search', values);
      } else {
        this.setState({
          dataLoading: false,
        });
      }
    });
  };

  clear = () => {
    const { form } = this.props;
    form.resetFields();
    rs.search(this, 'earnHotel/search');
  };

  render(): React.ReactNode {
    const { getFieldDecorator } = this.props.form;
    const { dataLoading } = this.state;

    return (
      <Form layout="inline">
        <Form.Item className={styles.formItem}>
          <Input.Group compact className={styles.inputGroup}>
            {getFieldDecorator('content', {
              rules: [],
            })(
              <Input.Search
                disabled={dataLoading}
                addonBefore={<span>全文检索</span>}
                placeholder="请输入搜索内容"
                onSearch={this.finish}
              />,
            )}
            <Button onClick={this.clear}>清除搜索条件</Button>
          </Input.Group>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<FullTextProps>()(FullText);

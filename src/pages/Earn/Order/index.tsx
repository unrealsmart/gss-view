import React, { Component } from 'react';
import { Button, Card, Col, Divider, Popconfirm, Row, Table } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

interface OrderProps {
  [key: string]: any;
}

class OrderIndex extends Component<OrderProps> {
  state = {
    tableLoading: true,
  };

  componentDidMount(): void {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'administrator/reader',
      }).then(() => {
        if (this.state.tableLoading) {
          this.setState({
            tableLoading: false,
          });
        }
      });
    }
  }

  /**
   * 全文检索 - 成功
   * @param form
   * @param searchAfter
   */
  fulltextFinish = (form: any, searchAfter: Function) => {
    this.setState({
      tableLoading: true,
    });

    const { dispatch } = this.props;
    form.validateFieldsAndScroll((errors: any, values: any) => {
      if (!errors) {
        dispatch({
          type: 'administrator/search',
          payload: {
            type: 'fulltext',
            ...values,
          },
        }).then(() => {
          if (this.state.tableLoading) {
            this.setState({
              tableLoading: false,
            });
            searchAfter();
          }
        });
      }
    });
  };

  /**
   * 全文检索 - 清除
   */
  fulltextClear = (): void => {
    this.setState({
      tableLoading: true,
    });
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'administrator/reader',
      }).then(() => {
        this.setState({
          tableLoading: false,
        });
      });
    }
  };

  render(): React.ReactNode {
    const { tableLoading } = this.state;
    const { administrator } = this.props;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 200,
        key: 'action',
        render: (_: void, record: any) => (
          <>
            <Link
              to={{
                pathname: '/system/administrator/detail',
                search: `id=${record.id}`,
              }}
            >
              查看
            </Link>
            <Divider type="vertical" />
            <Link
              to={{
                pathname: '/system/administrator/editor',
                search: `id=${record.id}`,
              }}
            >
              编辑
            </Link>
            <Divider type="vertical" />
            <Popconfirm title="是否删除？" disabled={record.username === 'admin'}>
              <a className={record.username === 'admin' ? 'disabled' : ''}>删除</a>
            </Popconfirm>
          </>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row gutter={16} type="flex" justify="space-between" style={{ marginBottom: 12 }}>
            <Col>
              <Link to={{ pathname: '/hotel/order/booking' }}>
                <Button type="primary" icon="plus">
                  新建
                </Button>
              </Link>
            </Col>
          </Row>
          <Table
            bordered
            loading={tableLoading}
            rowKey={(record: any) => record.id.toString()}
            dataSource={administrator.data}
            columns={columns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(() => ({}))(OrderIndex);

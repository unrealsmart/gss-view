import React, { Component, ReactNode } from 'react';
import { Button, Card, Checkbox, Col, Dropdown, Form, Input, Menu, Modal, Row, Table } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { TableProps } from 'antd/es/table';
import styles from './index.less';
import config from '../../../config/config';

interface DataManagerProps extends Component, FormComponentProps {
  columns: object[];
  loading: boolean | false;
  // 表格支持
  table: TableProps<any> | any;
  // 显示方式
  showType: 'table' | 'card';

  // 字段控制
  fields?: boolean | false;
  // 全文搜索
  fullText?: boolean | false;

  // // actions
  // create: {
  //   mode: string | 'new-page' | 'modal';
  //   // TODO path 不需要 config.base 时的设计
  //   path?: ''; // mode 为 'new-page' 时必须设置，path 前默认添加 config.base
  //   component?: Component; // mode 为 'modal' 时必须设置，并且穿
  // };
  // editor: {
  //   mode: string | 'new-page' | 'modal';
  //   path?: '';
  //   component?: Component;
  // };
  // // events
  // onSearch: (value: string, event?: any) => void;
  // onShowTypeChange: (type: string) => void;
  // onColumnsChange: (columns: object[]) => void;
  // any
  [key: string]: any;
}

interface DataManagerState {
  modalTitle: string | '';
  columns: object[];
  columnsVisible: boolean | false;
  createActionVisible: boolean | false;
  createActionConfirmLoading: boolean | false;
}

class DataManager extends Component<DataManagerProps, DataManagerState> {
  static defaultProps = {
    columns: [],
    loading: false,
    table: {},
    showType: 'table' as const,
    fields: false,
    fullText: false,
    create: {},
    editor: {},
  };

  state = {
    modalTitle: '',
    columns: [],
    columnsVisible: false,
    createActionVisible: false,
    createActionConfirmLoading: false,
  };

  componentDidMount(): void {
    //
    const { table } = this.props;
    this.setState({
      columns: table.columns || [],
    });
  }

  columnMenuClick = (e: any) => {
    e.domEvent.preventDefault(); // clicking on the menu item triggered twice! WTF?
    const { columns = [] } = this.state;
    const newColumns = columns.map((item: any) => {
      if (item.dataIndex === e.key) {
        const { show = true } = item;
        return {
          ...item,
          show: !show,
        };
      }
      return item;
    });
    this.setState({
      columns: newColumns,
    });
  };

  columnVisibleChange = (visible: boolean) => {
    this.setState({
      columnsVisible: visible,
    });
  };

  createActionClick = (): void => {
    this.setState({
      modalTitle: '新建',
      createActionVisible: true,
    });
  };

  createActionSubmit = () => {
    this.setState({
      createActionConfirmLoading: true,
    });
    console.log('submit');
  };

  search = () => {
    //
  };

  render(): ReactNode {
    const { table, fields, fullText, create } = this.props;
    const {
      modalTitle,
      columns,
      columnsVisible,
      createActionVisible,
      createActionConfirmLoading,
    } = this.state;

    // 在 Table 组件使用的 columns 数据中移除未展示的字段
    const newColumns: object[] = [];
    columns.forEach((item: any) => {
      const { show = true } = item;
      if (show) {
        newColumns.push(item);
      }
    });

    const ColumnMenu = (
      <Menu>
        {columns.map((item: any) => {
          const { show = true } = item;
          if (item.dataIndex === 'action') {
            return undefined;
          }
          return (
            <Menu.Item key={item.dataIndex} onClick={this.columnMenuClick}>
              <Checkbox checked={show}>{item.title}</Checkbox>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <div className={styles.dataManageContainer}>
        <Card bordered={false}>
          <Row type="flex" align="top" justify="space-between" style={{ marginBottom: 24 }}>
            <Col>
              <Row gutter={12} type="flex" align="top">
                {fields && (
                  <Col>
                    <Dropdown
                      overlay={ColumnMenu}
                      visible={columnsVisible}
                      onVisibleChange={this.columnVisibleChange}
                    >
                      <Button icon="bars" />
                    </Dropdown>
                  </Col>
                )}
                {fullText && (
                  <Col>
                    <Input.Search
                      style={{ width: 268 }}
                      allowClear
                      addonBefore="全文搜索"
                      disabled={!!table.loading}
                      placeholder="请输入搜索内容"
                      onSearch={this.props.onSearch}
                    />
                  </Col>
                )}
              </Row>
            </Col>
            <Col>
              <Row gutter={12} type="flex">
                <Col>
                  {create.mode === 'new-page' && (
                    <Button type="primary" icon="plus" href={`${config.base}${create.path}`}>
                      新建
                    </Button>
                  )}
                  {create.mode === 'modal' && (
                    <Button type="primary" icon="plus" onClick={this.createActionClick}>
                      新建
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
          <Table rowKey="id" {...table} columns={newColumns} />
          <Modal
            title={modalTitle}
            visible={createActionVisible}
            confirmLoading={createActionConfirmLoading}
            onOk={this.createActionSubmit}
            onCancel={() => {
              this.setState({
                createActionVisible: false,
              });
            }}
          >
            modal
          </Modal>
        </Card>
      </div>
    );
  }
}

export default Form.create<DataManagerProps>()(DataManager);

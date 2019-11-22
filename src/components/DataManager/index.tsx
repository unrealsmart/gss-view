import React, { Component, ReactNode } from 'react';
import { Button, Card, Checkbox, Col, Dropdown, Form, Input, Menu, Row, Table } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { TableProps } from 'antd/es/table';
import styles from './index.less';

interface DataManagerProps extends Component, FormComponentProps {
  showType: 'table' | 'card' | string;
  columns: object[];
  loading: boolean | false;
  table: TableProps<any>;
  fulltext?: [];
  //
  onSearch: (value: string, event?: any) => void;
  //
  onShowType: (type: string) => void;
  onColumnChange: (columns: object[]) => void;
  onDataShowTypeChange: (type: string) => void;
  // any
  [key: string]: any;
}

interface DataManagerState {
  //
  columns: object[];
  columnsVisible: boolean | false;
}

class DataManager extends Component<DataManagerProps, DataManagerState> {
  state = {
    //
    columns: [],
    columnsVisible: false,
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

  search = () => {
    //
  };

  render(): ReactNode {
    const { table } = this.props;
    const { columns, columnsVisible } = this.state;

    const newColumns: object[] = [];
    columns.forEach((item: any) => {
      const { show = true } = item;
      if (show) {
        newColumns.push(item);
      }
    });
    //
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

    //
    return (
      <div className={styles.dataManageContainer}>
        <Card bordered={false}>
          <Row type="flex" align="top" justify="space-between" style={{ marginBottom: 24 }}>
            <Col>
              <Row gutter={12} type="flex" align="top">
                <Col>
                  <Dropdown
                    overlay={ColumnMenu}
                    visible={columnsVisible}
                    onVisibleChange={this.columnVisibleChange}
                  >
                    <Button icon="bars" />
                  </Dropdown>
                </Col>
                <Col>
                  <Button icon="" />
                </Col>
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
              </Row>
            </Col>
            <Col>
              <Row gutter={12} type="flex">
                <Col>
                  <Button />
                </Col>
                <Col>
                  <Button type="primary" icon="plus">
                    新建
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <Table rowKey="id" {...table} columns={newColumns} />
        </Card>
      </div>
    );
  }
}

export default Form.create<DataManagerProps>()(DataManager);

import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, Row, Col, Button, Modal } from 'antd';
import { TableProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import styles from './index.less';
import ColumnVisible from '@/components/DataManager/ColumnVisible';
import isJSON from 'is-json';
import Fulltext from '@/components/DataManager/Fulltext';
import Filter from '@/components/DataManager/Filter';
import rs from '@/utils/rs';
import { ConnectState } from '@/models/connect';

interface DataManagerProps extends Component, FormComponentProps {
  // 表格（数据格式以表格为标准）
  table?: TableProps<object>;

  // 视图模式（表格 | 卡片 | 图表）(当数据项目使用自定义渲染时，此配置将会被设置为'custom')
  viewMode?: 'table' | 'card' | 'chart';
  // 视图切换器
  viewSwitch?: boolean;
  // 视图模式变化时调用
  onViewModeChange?: (mode: string) => void;

  // 列可见项（数据列可见性组件，默认可见）
  columnVisible?: boolean;
  // 列可见项缓存（默认开启，将可见的列存储至本地。关闭时，）
  columnVisibleCache?: boolean;
  // 列可见项变化时调用
  onColumnsVisibleChange?: () => void;

  // 过滤器（使用由用户预定义的规则选中数据项，之后可执行选取通用操作，例如：导出、移入回收站等）
  filter?: object[];

  // 全文搜索（）
  fulltext?: boolean;
  // 全文搜索 Url
  fulltextUrl?: string;
  // 全文搜索表单提交时调用
  onFulltextSubmit?: Function;

  // 新建
  create: string;

  // 任意配置
  [key: string]: any;
}

interface DataManagerState extends GlobalIndexClassState {
  dataColumns?: object[];
  // 列可见项
  // columnVisibleKeys: string[];
  modalProps?: object;
  modalContent?: any;
}

class DataManager extends Component<DataManagerProps, DataManagerState> {
  static defaultProps = {
    viewMode: 'table' as const,
    columnVisible: true,
    columnVisibleCache: true,
  };

  state = {
    dataColumns: [],
    // columnVisibleKeys: [],
    modalProps: {},
    modalContent: undefined,
  };

  componentDidMount(): void {
    const { table } = this.props;
    this.setState({
      dataColumns: this.loadColumnVisibleKeys() || (table && table.columns),
    });
  }

  saveColumnVisibleKeys = (values: object[]): void => {
    const { location } = this.props;
    const columnVisibleKeys: string[] = [];
    values.forEach((item: { show?: boolean; dataIndex?: string }) => {
      const { show = true } = item;
      if (show && item.dataIndex !== 'action' && item.dataIndex !== undefined) {
        columnVisibleKeys.push(item.dataIndex);
      }
    });
    localStorage.setItem(`dm-column-cache:${location.pathname}`, JSON.stringify(columnVisibleKeys));
  };

  loadColumnVisibleKeys = (): object[] | false => {
    const { location } = this.props;
    const cache = localStorage.getItem(`dm-column-cache:${location.pathname}`);
    if (cache && isJSON.strict(cache)) {
      const cacheArray = JSON.parse(cache);
      const { table } = this.props;
      const tableColumns = (table && table.columns) || [];
      return tableColumns.map((item: any) => {
        if (!cacheArray.includes(item.dataIndex) && item.dataIndex !== 'action') {
          return {
            ...item,
            show: false,
          };
        }
        return item;
      });
    }
    return false;
  };

  purifyColumns = (): object[] => {
    const { dataColumns } = this.state;
    const newDataColumns: object[] = [];
    dataColumns.forEach((item: any) => {
      const { show = true } = item;
      if (show) {
        newDataColumns.push(item);
      }
    });
    return newDataColumns;
  };

  existSubComponents = (): boolean => {
    const { viewSwitch, columnVisible, filter, fulltext } = this.props;
    return !!(viewSwitch || columnVisible || (filter && filter.length) || fulltext);
  };

  fulltextSearch = (value: string) => {
    rs(this, 'domain/search', { fs: value });
  };

  openModal = (args: any) => {
    this.setState({
      modalProps: args,
    });
  };

  setModal = (title: string, visible: boolean = true, confirmLoading: boolean = false) => {
    const modalProps = { title, visible, confirmLoading };
    this.setState({
      modalProps,
    });
  };

  closeModal = () => {
    const { modalProps } = this.state;
    this.setState({
      modalProps: { ...modalProps, visible: false },
    });
  };

  render(): React.ReactNode {
    const { table } = this.props;
    const { dataColumns, modalProps, modalContent } = this.state;
    const tableLoading: boolean = !!(table && table.loading);
    // console.log(table && table.columns);
    // const { columnVisibleKeys } = this.state;
    // console.log(columnVisibleKeys);
    console.log(modalContent);

    return (
      <div className={styles.dataManageContainer}>
        <Card bordered={false} style={{ marginBottom: 24 }}>
          {this.existSubComponents() && (
            <Row type="flex" justify="space-between" style={{ marginBottom: 24 }}>
              <Col>
                <Row type="flex" gutter={12}>
                  <Col>
                    <ColumnVisible
                      columns={dataColumns}
                      disabled={tableLoading}
                      onChange={(values: object[]) => {
                        this.setState({
                          dataColumns: values,
                        });
                        this.saveColumnVisibleKeys(values);
                      }}
                    />
                  </Col>
                  <Col>
                    <Filter disabled />
                  </Col>
                  <Col>
                    <Fulltext disabled={tableLoading} onSearch={this.fulltextSearch} />
                  </Col>
                </Row>
              </Col>
              <Col>
                <Button type="primary" icon="plus" onClick={() => this.setModal('新建')}>
                  新建
                </Button>
              </Col>
            </Row>
          )}
          <div className={styles.dataViewContainer}>
            <div className={styles.tableView}>
              <Table rowKey="id" {...table} columns={this.purifyColumns()} />
            </div>
          </div>
        </Card>

        <div className={styles.cardView}>
          <Row type="flex" gutter={12}>
            <Col style={{ marginBottom: 12 }}>
              <Card>卡片模式具有更多配置</Card>
            </Col>
            <Col style={{ marginBottom: 12 }}>
              <Card>这些配置与表格模式不同</Card>
            </Col>
            <Col style={{ marginBottom: 12 }}>
              <Card>例如间隔、每行展示数量</Card>
            </Col>
            <Col style={{ marginBottom: 12 }}>
              <Card>以及多个模式：rcc 包装模式、Card.Grid、Card.Meta、瀑布流等</Card>
            </Col>
          </Row>
        </div>

        <Modal {...modalProps} onCancel={this.closeModal}>
          form
        </Modal>
      </div>
    );
  }
}

// export default Form.create<DataManagerProps>()(DataManager);
export default connect(({ domain }: ConnectState) => ({
  domain,
}))(Form.create<DataManagerProps>()(DataManager));

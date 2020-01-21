import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Card, Table, Row, Col, Button, Modal, Divider } from 'antd';
import { TableProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import styles from './index.less';
import ColumnVisible from '@/components/DataManager/ColumnVisible';
import isJSON from 'is-json';
import Fulltext from '@/components/DataManager/Fulltext';
import Filter from '@/components/DataManager/Filter';
import rs from '@/utils/rs';
import { ConnectState } from '@/models/connect';
import { CardProps } from 'antd/es/card';

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

  // 内置操作
  create?: {
    path?: string;
    params?: object;
    component?: Component;
  };
  editor?: {
    path?: string;
    params?: object;
    component?: Component;
  };
  delete?: {
    path?: string;
    params?: object;
  };

  // 操作
  actions?: {
    [key: string]: Function;
  };

  // 卡片
  card?: CardProps;

  // 任意配置
  [key: string]: any;
}

interface DataManagerState extends GlobalClassState {
  dataColumns?: object[];
  modalProps?: object;
  mcc?: Component;
  formData?: object;
  formSign?: string;
}

class DataManager extends Component<DataManagerProps, DataManagerState> {
  private formRef: React.RefObject<unknown> | undefined;

  static defaultProps = {
    viewMode: 'table' as const,
    columnVisible: true,
    columnVisibleCache: true,
    actions: {},
  };

  state = {
    dataColumns: [],
    modalProps: {},
    mcc: undefined,
    formData: undefined,
    formSign: undefined,
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

  create = () => {
    const { create } = this.props;
    this.setModal('新建');
    this.setState({
      mcc: create && create.component,
      formData: {},
      formSign: 'create',
    });
    if (this.formRef) {
      const { loadData }: any = this.formRef;
      if (loadData) loadData({});
    }
  };

  editor = (id: number | string) => {
    const { editor } = this.props;
    this.setModal('更新');
    this.setState({
      mcc: editor && editor.component,
      formData: { id },
      formSign: 'editor',
    });
    if (this.formRef) {
      const { loadData }: any = this.formRef;
      if (loadData) loadData({ id });
    }
  };

  remove = (id: number | string) => {
    console.log('dm remove');
  };

  submit = () => {
    if (!this.formRef) {
      return;
    }
    const { props }: any = this.formRef;
    if (!props) {
      return;
    }
    const { modalProps }: any = this.state;
    this.setModal(modalProps.title, modalProps.visible, true);
    const { form } = props;
    form.validateFieldsAndScroll((errors: object, values: object) => {
      const { formSign }: any = this.state;
      if (!errors && this.props[formSign]) {
        const { rsp, onSubmit }: any = this.props[formSign];
        if (rsp) {
          const [ index, type ] = rsp();
          rs(index, type, values, () => {
            this.setModal(modalProps.title, false, false);
          });
        }
        else if (onSubmit) {
          onSubmit(values);
        }
        else {
          console.log('没有执行 rsp 或 onSubmit');
        }
      }
    });
  };

  render(): React.ReactNode {
    const { table, card } = this.props;
    const { dataColumns, modalProps, mcc, formData } = this.state;
    const tableLoading: boolean = !!(table && table.loading);
    const Mcc: any = mcc || (() => <span style={{ color: '#f00' }}>未载入内容</span>);

    return (
      <div className={styles.dataManageContainer}>
        <Card bordered={false} style={{ marginBottom: 24 }} {...card}>
          {this.existSubComponents() && (
            <Row type="flex" justify="space-between" style={{ marginBottom: 12 }}>
              <Col style={{ marginBottom: 12 }}>
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
                    <Button icon="safety" disabled />
                  </Col>
                  <Col>
                    <Filter disabled />
                  </Col>
                  <Col>
                    <Fulltext disabled={tableLoading} onSearch={this.fulltextSearch} />
                  </Col>
                </Row>
              </Col>
              <Col style={{ marginBottom: 12 }}>
                <Row type="flex" gutter={12}>
                  <Col>
                    <Button icon="setting" disabled />
                  </Col>
                  <Col style={{ display: 'flex', alignItems: 'center' }}>
                    <Divider type="vertical" style={{ margin: 0 }} />
                  </Col>
                  <Col>
                    <Button type="primary" icon="plus" onClick={this.create}>
                      新建
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          <div className={styles.dataViewContainer}>
            <div className={styles.tableView}>
              <Table
                {...table}
                rowKey="id"
                columns={this.purifyColumns()}
              />
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

        <Modal {...modalProps} onOk={this.submit} onCancel={this.closeModal}>
          <Mcc
            wrappedComponentRef={(ref: React.RefObject<unknown>) => {
              this.formRef = ref;
            }}
            value={formData}
          />
        </Modal>
      </div>
    );
  }
}

// export default Form.create<DataManagerProps>()(DataManager);
export default connect(({ domain }: ConnectState) => ({
  domain,
}))(Form.create<DataManagerProps>()(DataManager));

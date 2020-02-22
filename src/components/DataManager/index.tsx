import React, { Component, ComponentProps } from 'react';
import { Form, Card, Table, Row, Col, Button, Modal, Divider } from 'antd';
import { TableProps } from 'antd/es/table';
import { FormComponentProps } from 'antd/es/form';
import { CardProps } from 'antd/es/card';
import ColumnVisible from '@/components/DataManager/ColumnVisible';
import isJSON from 'is-json';
import Fulltext from '@/components/DataManager/Fulltext';
import Filter from '@/components/DataManager/Filter';
import { ra } from '@/utils/utils';
import styles from './index.less';

type Actions =
  | {
      fc?: Component; // formComponent
      fom?: 'modal' | 'page'; // formOpenMode
      type: string;
      params?: object;
      callback?: Function;
    }
  | Function;

interface DataManagerProps extends Component, FormComponentProps {
  // 使用者实例
  instance: ComponentProps<any>;

  // 元素内容 TODO 增加扩展元素
  // beforeElement?: any;
  // afterElement?: any;

  // 视图模式（表格 | 卡片 | 图表）(当数据项目使用自定义渲染时，此配置将会被设置为'custom')
  viewMode?: 'table' | 'card' | 'chart';
  // 视图切换器
  viewSwitch?: boolean;
  // 视图模式变化时调用
  onViewModeChange?: (mode: string) => void;

  // 加载状态
  loading?: boolean;

  // 表格模式（基于 Ant Design Table 组件，且传递的数据格式以表格为标准）
  table?: TableProps<object>;
  // 表格容器
  tableContainer?: CardProps;

  // 卡片模式
  // 卡片容器
  // 卡片项目容器

  // 列可见项（数据列可见性组件，默认可见）
  columnVisible?: boolean;
  // 列可见项缓存（默认开启，将可见的列存储至本地。关闭时，按照设置显示或隐藏）
  columnVisibleCache?: boolean;
  // 列可见项变化时调用
  onColumnsVisibleChange?: () => void;

  // 过滤器（使用由用户预定义的规则选中数据项，之后可执行选取通用操作，例如：导出、移入回收站等）
  filter?: object[];

  // 全文搜索（可用的搜索项由服务端程序决定，一般使用SQL模糊搜索，另外受到SQL LIKE限制，不能模糊匹配日期及其范围）
  fulltext?: boolean;

  // 操作（内置的操作：创建、更新、删除、查询、全文搜索）
  actions: {
    [key: string]: Actions;
  };

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
      if (show && item.dataIndex !== undefined) {
        columnVisibleKeys.push(item.dataIndex);
      }
    });
    const cacheName = `dmcc${location.pathname.replace(/\//g, '-')}`;
    localStorage.setItem(cacheName, JSON.stringify(columnVisibleKeys));
  };

  loadColumnVisibleKeys = (): object[] | false => {
    const { location } = this.props;
    const cacheName = `dmcc${location.pathname.replace(/\//g, '-')}`;
    const cacheValue = localStorage.getItem(cacheName);
    if (cacheValue && isJSON.strict(cacheValue)) {
      const cacheArray = JSON.parse(cacheValue);
      const { table } = this.props;
      const tableColumns = (table && table.columns) || [];
      return tableColumns.map((item: any) => {
        if (!cacheArray.includes(item.dataIndex) && item.dataIndex !== undefined) {
          return { ...item, show: false };
        }
        return { ...item, show: true };
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

  setModal = (title: string, visible: boolean = true, confirmLoading: boolean = false) => {
    const modalProps = { title, visible, confirmLoading };
    this.setState({ modalProps });
    if (!visible) this.resetForm();
  };

  resetForm = () => {
    if (!this.formRef) return;
    const { props }: any = this.formRef;
    if (props.form) props.form.resetFields();
  };

  closeModal = () => {
    const { modalProps } = this.state;
    const newModalProps = { ...modalProps, visible: false };
    this.setState({ modalProps: newModalProps });
    this.resetForm();
  };

  fulltextSearch = (value: string) => {
    const { instance } = this.props;
    const { search } = this.props.actions;
    if (typeof search === 'function') {
      search(value);
      return;
    }
    ra(instance, search && search.type, { fs: value });
  };

  create = () => {
    const { create }: any = this.props.actions;
    this.setModal('新建');
    this.setState({
      mcc: create && create.fc,
      formData: create.params || {},
      formSign: 'create',
    });
    if (this.formRef) {
      const { loadData }: any = this.formRef;
      if (loadData) loadData(create.params || {});
    }
  };

  update = (id: number | string) => {
    const { update }: any = this.props.actions;
    this.setModal('更新');
    this.setState({
      mcc: update && update.fc,
      formData: { id },
      formSign: 'update',
    });
    if (this.formRef) {
      const { loadData }: any = this.formRef;
      if (loadData) loadData({ id });
    }
  };

  remove = (id: number | string) => {
    const { instance, actions } = this.props;
    const { remove }: any = actions;
    ra(instance, remove.type, { id });
  };

  submit = () => {
    if (!this.formRef) return;
    const { instance, actions } = this.props;
    const { modalProps, formSign }: any = this.state;
    const { props }: any = this.formRef;
    this.setModal(modalProps.title, modalProps.visible, true);
    if (!props) return;
    props.form.validateFieldsAndScroll((errors: object, values: object) => {
      if (errors || !actions[formSign]) {
        console.log(errors);
        this.setModal(modalProps.title, true);
        return;
      }
      const mix = actions[formSign];
      if (typeof mix === 'function') {
        mix(values);
      }
      if (typeof mix === 'object') {
        ra(instance, mix && mix.type, values, () => {
          this.setModal(modalProps.title, false, false);
          this.resetForm();
        });
      }
    });
  };

  render(): React.ReactNode {
    const { loading, table, tableContainer, viewMode } = this.props;
    const { dataColumns, modalProps, mcc, formData } = this.state;
    const Mcc: any = mcc || (() => <span style={{ color: '#f00' }}>未载入内容</span>);

    const tableElement = (
      <Card bordered={false} style={{ marginBottom: 24 }} {...tableContainer}>
        {this.existSubComponents() && (
          <Row type="flex" justify="space-between" style={{ marginBottom: 12 }}>
            <Col style={{ marginBottom: 12 }}>
              <Row type="flex" gutter={12}>
                <Col>
                  <ColumnVisible
                    columns={dataColumns}
                    disabled={loading}
                    onChange={(values: object[]) => {
                      this.setState({ dataColumns: values });
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
                  <Fulltext disabled={loading} onSearch={this.fulltextSearch} />
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
              scroll={{ x: 900, scrollToFirstRowOnChange: true }}
              loading={loading}
              {...table}
              rowKey="id"
              columns={this.purifyColumns()}
            />
          </div>
        </div>
      </Card>
    );

    const cardElement = (
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
    );

    return (
      <div className={styles.dataManageContainer}>
        {viewMode === 'table' && tableElement}
        {viewMode === 'card' && cardElement}
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

export default Form.create<DataManagerProps>()(DataManager);
// export default connect(() => ({
//   //
// }))(Form.create<DataManagerProps>()(DataManager));

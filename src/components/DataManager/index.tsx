import React, { Component, FunctionComponent, ReactNode } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  Modal,
  Row,
  Table,
  Tooltip,
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { TableProps } from 'antd/es/table';
import styles from './index.less';
import config from '../../../config/config';

type FormAction = {
  mode?: 'new-page' | 'modal';
  path?: ''; // TODO path 不需要 config.base 时的设计
  customRender?: Component;
};

interface DataManagerProps extends Component, FormComponentProps {
  // 表格配置
  table?: TableProps<object> | any;

  // 特殊

  // 状态
  loading: boolean;

  // 子组件

  // 字段
  fields?:
    | boolean
    | {
        show?: boolean;
        cache?: boolean; // 是否开启缓存功能（缓存根据 route path 存储于 localStorage）
      };
  // 选择器
  selector?: boolean;
  // 全文搜索
  fulltext?: boolean;
  // 视图切换
  views?: boolean;

  // 操作
  actions: {
    // 新建
    create?: FormAction;
    // 编辑
    editor?: FormAction;
    // 删除
    delete?: any;
    // 发布
    publish?: any;
    // 导入
    import?: any;
    // 导出
    export?: any;
    // 移入回收站
    moveRecycleBin?: any;
  };

  // 事件

  //
  onLoading: (loading: boolean) => void;
  // 关闭模态框
  closeModal: Function;
  // 打开新建
  openCreate: Function;
  // 打开编辑
  openEditor: Function;

  //
  // onSearch: (value: string, event?: any) => void;
  // onShowTypeChange: (type: string) => void;
  // onColumnsChange: (columns: object[]) => void;
  // any
  [key: string]: any;
}

interface DataManagerState {
  dataColumns: object[];
  actionType: 'create' | 'editor';
  formTitle: string;
  columnVisible: boolean;
  modalVisible: boolean;
  modalConfirmLoading: boolean | false;
}

class DataManager extends Component<DataManagerProps, DataManagerState> {
  private formRef: any;

  static defaultProps = {
    table: {
      columns: [],
      dataSource: [],
    },
    loading: false,

    fields: {
      show: true,
      cache: true,
    },
    selector: true,
    fulltext: true,

    actions: {},
  };

  state = {
    dataColumns: [],
    actionType: 'create' as const,
    formTitle: '',
    columnVisible: false,
    modalVisible: false,
    modalConfirmLoading: false,
  };

  componentDidMount(): void {
    const { table } = this.props;
    this.setState({
      dataColumns: table.columns,
    });

    console.log(this.formRef);
  }

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  // 显示方式切换事件
  showTypeChange = () => {
    console.log('on show type change');
  };

  // 净化列
  purifyColumns = () => {
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

  // 菜单列覆盖层
  columnMenuOverlay = () => {
    const { dataColumns } = this.state;
    return (
      <Menu>
        {dataColumns.map((item: any) => {
          const { show = true } = item;
          if (item.dataIndex === 'action') {
            return undefined;
          }
          return (
            <Menu.Item key={item.dataIndex} onClick={this.columnMenuItemClick}>
              <Checkbox checked={show}>{item.title}</Checkbox>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  };

  // 菜单列点击事件
  columnMenuItemClick = (e: any) => {
    e.domEvent.preventDefault(); // clicking on the menu item triggered twice! WTF?
    const { dataColumns = [] } = this.state;
    const showColumns: string[] = [];
    const newColumns = dataColumns.map((item: any) => {
      if (item.dataIndex === e.key) {
        const { show = true } = item;
        if (show) {
          showColumns.push(item.title);
        }
        return {
          ...item,
          show: !show,
        };
      }
      return item;
    });
    this.setState({
      dataColumns: newColumns,
    });
  };

  columnVisibleChange = (visible: boolean) => {
    this.setState({
      columnVisible: visible,
    });
  };
  //
  // createActionSubmit = () => {
  //   this.setState({
  //     createActionConfirmLoading: true,
  //   });
  //   console.log('submit');
  // };
  //
  // search = () => {
  //   //
  // };

  // close modal
  closeModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  // open create
  openCreate = () => {
    this.setState({
      formTitle: '新建',
      modalVisible: true,
    });
  };

  render(): ReactNode {
    const { table, fields, selector, fulltext, actions } = this.props;
    const { actionType, formTitle, columnVisible, modalVisible, modalConfirmLoading } = this.state;
    const tableLoading: boolean = table && table.loading;
    const isHaveChildComponent: boolean | undefined =
      typeof fields === 'object' ? fields.show : fields;

    const NotFormError: FunctionComponent = () => <span>not form</span>;
    const CreateForm: any = (actions.create && actions.create.customRender) || NotFormError;

    return (
      <div className={styles.dataManageContainer}>
        <Button
          onClick={() => {
            this.formRef.submit('test');
          }}
        >
          测试 CreateForm 函数
        </Button>

        <Card bordered={false}>
          {isHaveChildComponent && (
            <Row type="flex" align="top" justify="space-between" style={{ marginBottom: 24 }}>
              <Col>
                <Row gutter={12} type="flex" align="top">
                  {fields && (
                    <Col>
                      <Dropdown
                        overlay={this.columnMenuOverlay()}
                        visible={columnVisible}
                        onVisibleChange={this.columnVisibleChange}
                        disabled={tableLoading}
                      >
                        <Button icon="bars" />
                      </Dropdown>
                    </Col>
                  )}
                  {selector && (
                    <Col>
                      <Button icon="filter" disabled={tableLoading} />
                    </Col>
                  )}
                  {fulltext && (
                    <Col>
                      <Input.Search
                        style={{ width: 268 }}
                        allowClear
                        addonBefore={
                          <>
                            <span>全文搜索</span>
                            <Tooltip title="全文搜索的结果取决于服务器">
                              <Icon type="question-circle" style={{ marginLeft: 4 }} />
                            </Tooltip>
                          </>
                        }
                        disabled={tableLoading}
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
                    {actions.create && actions.create.mode === 'new-page' && (
                      <Button
                        type="primary"
                        icon="plus"
                        href={`${config.base}${actions.create.path}`}
                      >
                        新建
                      </Button>
                    )}
                    {actions.create && actions.create.mode === 'modal' && (
                      <Button type="primary" icon="plus" onClick={this.openCreate}>
                        新建
                      </Button>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
          )}
          <div style={{ position: 'relative' }}>
            <Table rowKey="id" {...table} columns={this.purifyColumns()} />
            <div className={styles.selectBeforeContainer}>
              <Button type="primary" icon="audit">
                发布
              </Button>
              <Button type="default" icon="export">
                导出
              </Button>
              <Button type="danger" icon="delete">
                移入回收站
              </Button>
            </div>
          </div>
          <Modal
            title={formTitle}
            visible={modalVisible}
            confirmLoading={modalConfirmLoading}
            // onOk={this.createActionSubmit}
            onCancel={this.closeModal}
          >
            {actions.create && actionType === 'create'}
            <CreateForm
              wrappedComponentRef={(ref: React.RefObject<unknown>) => {
                this.formRef = ref;
              }}
            />
          </Modal>
        </Card>
      </div>
    );
  }
}

export default Form.create<DataManagerProps>()(DataManager);

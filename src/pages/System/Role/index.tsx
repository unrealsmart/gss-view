import React, { Component } from 'react';
import { connect } from 'dva';
import rs from '@/utils/rs';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import DataManager from '@/components/DataManager';
import { Divider, Popconfirm } from 'antd';
import { DomainModelItem } from '@/models/system/domain';
import BizForm from './form';
import tree from '@/utils/tree';

interface RoleIndexProps {
  tableProps: object;
  fieldShow: object;
  [key: string]: any;
}

interface RoleIndexState extends GlobalClassState {}

class RoleIndex extends Component<RoleIndexProps, RoleIndexState> {
  private dmRef: React.RefObject<unknown>;

  constructor(props: RoleIndexProps) {
    super(props);
    this.dmRef = React.createRef();
  }

  state = {
    dataLoading: true,
  };

  componentDidMount(): void {
    rs(this, 'domain/search');
  }

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  render(): React.ReactNode {
    const { domain } = this.props;
    const { dataLoading } = this.state;
    const table = {
      loading: dataLoading,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 65,
        },
        {
          title: '标题',
          dataIndex: 'title',
          width: 120,
        },
        {
          title: '描述',
          dataIndex: 'description',
        },
        {
          title: '日期',
          dataIndex: 'datetime',
          width: 140,
          render: (_: string, record: any) => (
            <>
              <div style={{ color: '#ccc' }}>{record.create_time || 'NULL'}</div>
              <div>{record.update_time || 'NULL'}</div>
            </>
          ),
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center' as const,
          width: 65,
          show: false,
          render: (text: any) => <div>{text}</div>,
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 140,
          fixed: 'right',
          render: (_: void, record: DomainModelItem) => {
            const { id = 0 } = record;
            return (
              <div>
                {record.name === 'main' ? (
                  <a className="disabled">编辑</a>
                ) : (
                  <a onClick={() => {
                    const { editor }: any = this.dmRef;
                    if (editor) editor(id);
                  }}>
                    编辑
                  </a>
                )}
                <Divider type="vertical" />
                {record.name === 'main' ? (
                  <a className="disabled">删除</a>
                ) : (
                  <Popconfirm title="是否删除？" onConfirm={() => {
                    const { remove }: any = this.dmRef;
                    if (remove) remove(this, 'domain/remove');
                  }}>
                    <a>删除</a>
                  </Popconfirm>
                )}
              </div>
            );
          },
        },
      ],
      dataSource: domain.list,
      scroll: {
        x: 900,
        scrollToFirstRowOnChange: true,
      },
    };
    const tabList = tree.fetchTabList(domain.list);

    return (
      <PageHeaderWrapper>
        <DataManager
          wrappedComponentRef={(dmRef: React.RefObject<unknown>) => {
            this.dmRef = dmRef;
          }}
          card={{
            tabList,
            onTabChange: (key: string) => {
              this.setState({ dataLoading: true });
              console.log(tree.fetch(domain.list, key, 'name'));
              rs(this, 'role/search');
            },
          }}
          table={table}
          create={{
            component: BizForm,
            rsp: () => [this, 'domain/create'],
          }}
          editor={{
            component: BizForm,
            rsp: () => [this, 'domain/update'],
          }}
          actions={{}}
          {...this.props}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({
  domain, role
}: ConnectState) => ({
  role,
  domain,
}))(RoleIndex);

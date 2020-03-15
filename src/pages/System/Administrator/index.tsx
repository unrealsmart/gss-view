import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import { ConnectState } from '@/models/connect';
import DataManager from '@/components/DataManager';
import { AdministratorModelItem } from '@/models/system/administrator';
import { Divider, Popconfirm, Tag, Switch } from 'antd';
import { ra } from '@/utils/utils';
import BizForm from '@/pages/System/Administrator/form';

interface AdministratorIndexProps {
  tableProps: object;
  fieldShow: object;
  [key: string]: any;
}

interface AdministratorIndexState extends GlobalClassState {
  //
}

class AdministratorIndex extends Component<AdministratorIndexProps, AdministratorIndexState> {
  private dmRef: React.RefObject<unknown>;

  constructor(props: AdministratorIndexProps) {
    super(props);
    this.dmRef = React.createRef();
  }

  state = {
    dataLoading: false,
  };

  componentDidMount(): void {
    ra(this, 'administrator/search');
  }

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  render(): React.ReactNode {
    const { currentUser, administrator } = this.props;
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
          title: '用户名',
          dataIndex: 'username',
          width: 120,
        },
        {
          title: '租域',
          dataIndex: 'domain',
          align: 'center' as const,
          width: 72,
          render: (_: void, user: AdministratorModelItem) => (
            <Tag color="magenta" key={user.domain.id.toString()}>
              {user.domain.title}
            </Tag>
          ),
        },
        {
          title: '角色',
          dataIndex: 'roles',
          width: 150,
          align: 'center' as const,
          render: (text: object[]) => (
            <>
              {text.map((role: any) => (
                <Tag key={role.id.toString()}>{role.title}</Tag>
              ))}
            </>
          ),
        },
        {
          title: '手机号码',
          dataIndex: 'phone',
          width: 98,
          render: (text: string) => <a href={`tel:${text}`}>{text}</a>,
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          width: 138,
          render: (text: string) => <a href={`mailto:${text}`}>{text}</a>,
        },
        {
          title: '描述',
          dataIndex: 'description',
        },
        {
          title: '状态',
          dataIndex: 'status',
          align: 'center' as const,
          render: (text: number) => (
            <Switch
              checked={!!text}
              size="small"
              onClick={(checked: boolean) => {
                console.log(checked);
              }}
            />
          ),
        },
        {
          title: '操作',
          width: 140,
          align: 'center',
          fixed: 'right',
          render: (_: void, record: AdministratorModelItem) => {
            const { id = 0 } = record;
            return (
              <div>
                <Link to={`/system/administrator/detail?id=${id}`}>详情</Link>
                <Divider type="vertical" />
                {record.username === 'admin' && currentUser.username !== 'admin' ? (
                  <a className="disabled">编辑</a>
                ) : (
                  <a
                    onClick={() => {
                      const { update }: any = this.dmRef;
                      if (update) update(id);
                    }}
                  >
                    编辑
                  </a>
                )}
                <Divider type="vertical" />
                {record.username === 'admin' ? (
                  <a className="disabled">删除</a>
                ) : (
                  <Popconfirm
                    title="是否删除？"
                    onConfirm={() => {
                      const { remove }: any = this.dmRef;
                      if (remove) remove(this, 'administrator/remove');
                    }}
                  >
                    <a>删除</a>
                  </Popconfirm>
                )}
              </div>
            );
          },
        },
      ],
      dataSource: administrator.list,
      scroll: {
        x: 900,
        scrollToFirstRowOnChange: true,
      },
    };

    return (
      <div>
        {/*
        <DataManager
          wrappedComponentRef={(dmRef: React.RefObject<unknown>) => {
            this.dmRef = dmRef;
          }}
          instance={this}
          table={table}
          actions={{
            search: { type: 'administrator/search' },
            create: { fc: BizForm, type: 'administrator/create' },
            update: { fc: BizForm, type: 'administrator/update' },
          }}
          beforeElement={<div>在头部添加上一些内容</div>}
          {...this.props}
        />
        */}
      </div>
    );
  }
}

export default connect(({ user, domain, role, administrator }: ConnectState) => ({
  currentUser: user.currentUser,
  domain,
  role,
  administrator,
}))(AdministratorIndex);

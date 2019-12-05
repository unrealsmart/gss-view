import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import rs from '@/utils/rs';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import DataManager from '@/components/DataManager';
import { AdministratorModelItem } from '@/models/system/administrator';
import { Divider, Popconfirm, Tag } from 'antd';

interface AdministratorIndexProps {
  tableProps: object;
  fieldShow: object;
  [key: string]: any;
}

interface AdministratorIndexState extends GlobalIndexClassState {
  showType: 'table' | 'card' | string;
}

class AdministratorIndex extends Component<AdministratorIndexProps, AdministratorIndexState> {
  state = {
    dataLoading: true,
    showType: 'table',
  };

  componentDidMount(): void {
    // 使用rs工具请求数据
    rs.search(this, 'administrator');
  }

  render(): React.ReactNode {
    const { administrator } = this.props;
    const { dataLoading, showType } = this.state;

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
          render: (_: void, { domain }: AdministratorModelItem) => (
            <Link to={`/system/domain?id=${domain.id}`} style={{ display: 'inline-block' }}>
              <Tag color="magenta">{domain.title}</Tag>
            </Link>
          ),
        },
        {
          title: '角色',
          dataIndex: 'roles',
          width: 150,
          align: 'center' as const,
          render: (text: object[]) => (
            <div>
              {text.map((item: any) => (
                <Tag key={item.sub}>{item.des}</Tag>
              ))}
            </div>
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
          show: false,
          render: (text: any) => <div>{text}</div>,
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 140,
          fixed: 'right',
          render: (_: void, record: AdministratorModelItem) => {
            const { id = 0 } = record;
            return (
              <div>
                <Link to={`/system/administrator/detail?id=${id}`}>详情</Link>
                <Divider type="vertical" />
                <Link to={`/system/administrator/editor?id=${id}`}>编辑</Link>
                <Divider type="vertical" />
                {record.username === 'admin' ? (
                  <a className="disabled">删除</a>
                ) : (
                  <Popconfirm title="是否删除？">
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
      <PageHeaderWrapper>
        <DataManager
          showType={showType}
          table={table}
          onSearch={(value: string) => {
            rs.search(this, 'administrator', {
              fulltext: value,
            });
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ administrator }: ConnectState) => ({
  // class model item
  administrator,
}))(AdministratorIndex);

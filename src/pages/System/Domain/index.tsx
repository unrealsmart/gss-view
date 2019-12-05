import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi';
import rs from '@/utils/rs';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import DataManager from '@/components/DataManager';
import { Divider, Popconfirm } from 'antd';
import { DomainModelItem } from '@/models/system/domain';
import BizForm from './form';

interface DomainIndexProps {
  tableProps: object;
  fieldShow: object;
  [key: string]: any;
}

interface DomainIndexState extends GlobalIndexClassState {
  showType: 'table' | 'card' | string;
}

class DomainIndex extends Component<DomainIndexProps, DomainIndexState> {
  state = {
    dataLoading: true,
    showType: 'table',
  };

  componentDidMount(): void {
    // 使用rs工具请求数据
    rs.search(this, 'domain');
  }

  render(): React.ReactNode {
    const { domain } = this.props;
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
          title: '标题',
          dataIndex: 'title',
          width: 120,
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
          render: (_: void, record: DomainModelItem) => {
            const { id = 0 } = record;
            return (
              <div>
                {record.name === 'main' ? (
                  <a className="disabled">编辑</a>
                ) : (
                  <Link to={`/system/domain/editor?id=${id}`}>编辑</Link>
                )}
                <Divider type="vertical" />
                {record.name === 'main' ? (
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
      dataSource: domain.list,
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
          actions={{
            create: {
              mode: 'modal',
              component: BizForm,
            },
          }}
          createPath="/system/domain/editor"
          onSearch={(value: string) => {
            rs.search(this, 'domain', {
              fulltext: value,
            });
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ domain }: ConnectState) => ({
  // class model item
  domain,
}))(DomainIndex);

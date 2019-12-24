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

interface DomainIndexState extends GlobalIndexClassState {}

class DomainIndex extends Component<DomainIndexProps, DomainIndexState> {
  private dmRef: React.RefObject<unknown>;

  constructor(props: DomainIndexProps) {
    super(props);
    this.dmRef = React.createRef();
  }

  state = {
    dataLoading: true,
  };

  componentDidMount(): void {
    rs(this, 'domain/search');

    console.log(this.dmRef);
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
    const actions = {
      create: {
        mode: 'modal',
        path: 'system/domain/create',
        customRender: BizForm,
      },
      selector: true,
    };

    return (
      <PageHeaderWrapper>
        <DataManager
          wrappedComponentRef={(dmRef: React.RefObject<unknown>) => {
            this.dmRef = dmRef;
          }}
          table={table}
          actions={actions}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ domain }: ConnectState) => ({
  // class model item
  domain,
}))(DomainIndex);

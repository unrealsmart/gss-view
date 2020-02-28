import React, { Component } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import DataManager from '@/components/DataManager';
import { Divider, Popconfirm, Switch } from 'antd';
import tree from '@/utils/tree';
import { ra, rss } from '@/utils/utils';
import columns from '@/utils/columns';
import BizForm from './form';

interface RoleIndexProps {
  tableProps: object;
  fieldShow: object;
  [key: string]: any;
}

interface RoleIndexState extends GlobalClassState {
  tabKey: string;
}

class RoleIndex extends Component<RoleIndexProps, RoleIndexState> {
  private dmRef: React.RefObject<unknown>;

  constructor(props: RoleIndexProps) {
    super(props);
    this.dmRef = React.createRef();
    columns.instance(this);
  }

  state = {
    dataLoading: true,
    tabKey: '',
    currentDomain: undefined,
  };

  componentDidMount(): void {
    const rit = rss.instance(this);
    console.log(rit);

    // ra(this, 'domain/search').then((domain: any) => {
    //   ra(this, 'role/search', { id: domain[0] && domain[0].id })
    // });
  }

  componentWillUnmount(): void {
    this.setState = () => {};
  }

  render(): React.ReactNode {
    const { domain, role } = this.props;
    const { dataLoading, tabKey, currentDomain } = this.state;
    const tableColumns = [
      columns.id(),
      columns.name(),
      columns.title(),
      columns.description(),
      columns.datetime(),
      columns.status({
        render: (text: number, record: any) => (
          <Switch
            checked={!!text}
            size="small"
            disabled={record.name === 'admin'}
            onClick={(checked: boolean) => {
              ra(this, 'role/update', { id: record.id, status: checked ? 1 : 0 });
            }}
          />
        ),
      }),
      columns.actions({
        render: (_: void, record: any) => {
          const { id = 0 } = record;
          return (
            <div>
              {record.name === 'admin' ? (
                <a className="disabled">编辑</a>
              ) : (
                <a
                  onClick={() => {
                    columns.cache_instance.dmRef.update(id);
                  }}
                >
                  编辑
                </a>
              )}
              <Divider type="vertical" />
              {record.name === 'admin' ? (
                <a className="disabled">删除</a>
              ) : (
                <Popconfirm
                  title="是否删除？"
                  onConfirm={() => {
                    const { remove }: any = this.dmRef;
                    if (remove) remove(id);
                  }}
                >
                  <a>删除</a>
                </Popconfirm>
              )}
            </div>
          );
        },
      }),
    ];
    const tabList = tree.fetchTabList(domain.list);

    return (
      <div>
        <DataManager
          wrappedComponentRef={(dmRef: React.RefObject<unknown>) => {
            this.dmRef = dmRef;
          }}
          instance={this}
          loading={dataLoading}
          table={{ columns: tableColumns, dataSource: role.list }}
          tableContainer={{
            tabList,
            defaultActiveTabKey: tabList[0] && tabList[0].key,
            activeTabKey: tabKey || (tabList[0] && tabList[0].key),
            onTabChange: (key: string) => {
              if (dataLoading) return;
              const value = tree.fetch(domain.list, key, 'name');
              this.setState({ currentDomain: value.id });
              ra(this, 'role/search', { domain: value.id }).then(() => {
                this.setState({ tabKey: tree.fetch(tabList, value.name, 'key').key });
              });
            },
          }}
          actions={{
            create: {
              type: 'role/create',
              fc: BizForm,
              params: { domain: currentDomain || (domain.list[0] && domain.list[0].id) },
            },
            update: { type: 'role/update', fc: BizForm },
            search: { type: 'role/search' },
            remove: { type: 'role/remove' },
          }}
          {...this.props}
        />
      </div>
    );
  }
}

export default connect(({ domain, role }: ConnectState) => ({
  domain,
  role,
}))(RoleIndex);

import React, { Component } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Manage, Action, Columns, FieldVisible, Fulltext } from '@/components/Container';
import { ra } from '@/utils/utils';
import columns from '@/utils/columns';

interface DomainIndexProps {
  tableProps: object;
  fieldShow: object;
  [key: string]: any;
}

interface DomainState extends GlobalClassState {}

class Domain extends Component<DomainIndexProps, DomainState> {
  protected dmRef: React.RefObject<unknown>;

  constructor(props: DomainIndexProps) {
    super(props);
    this.dmRef = React.createRef();
  }

  state = {
    dataLoading: true,
  };

  componentDidMount(): void {
    ra(this, 'domain/search');
  }

  componentWillUnmount(): void {
    this.setState = () => {};
  }

  render(): React.ReactNode {
    columns.instance(this);
    const { domain } = this.props;
    const { dataLoading } = this.state;
    // const tableColumns = [
    //   columns.id(),
    //   columns.name({ width: 150 }),
    //   columns.title(),
    //   columns.description(),
    //   columns.datetime(),
    //   columns.status({
    //     render: (text: number, record: any) => (
    //       <Switch
    //         checked={!!text}
    //         size="small"
    //         disabled={record.name === 'main'}
    //         loading={record.loading}
    //         onClick={(checked: boolean) => {
    //           ra(this, 'domain/update', { id: record.id, status: checked ? 1 : 0 });
    //         }}
    //       />
    //     ),
    //   }),
    //   columns.actions({
    //     render: (_: void, record: any) => {
    //       const { id = 0 } = record;
    //       return (
    //         <div>
    //           {record.name === 'main' ? (
    //             <a className="disabled">编辑</a>
    //           ) : (
    //             <a
    //               onClick={() => {
    //                 columns.cache_instance.dmRef.update(id);
    //               }}
    //             >
    //               编辑
    //             </a>
    //           )}
    //           <Divider type="vertical" />
    //           {record.name === 'main' ? (
    //             <a className="disabled">删除</a>
    //           ) : (
    //             <Popconfirm
    //               title="是否删除？"
    //               onConfirm={() => {
    //                 columns.cache_instance.dmRef.remove(id);
    //               }}
    //             >
    //               <a>删除</a>
    //             </Popconfirm>
    //           )}
    //         </div>
    //       );
    //     },
    //   }),
    // ];

    return (
      <Manage loading={dataLoading} data={domain}>
        <Columns>
          <Columns.ID />
          <Columns.Name />
          <Columns.Description />
          <Columns.DateTime />
          <Columns.Status />
          <Columns.Actions>
            <Action.Update />
            <Action.Retrieve />
            <Action.Remove />
          </Columns.Actions>
        </Columns>
        <FieldVisible />
        <Fulltext modalType="domain/search" fieldName="fs" />
        <Action.Create />
      </Manage>
    );
  }
}

export default connect(({ domain }: ConnectState) => ({
  domain,
}))(Domain);

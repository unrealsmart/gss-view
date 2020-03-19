import React, { ComponentProps } from 'react';
import { Switch } from 'antd';

type GlobalFunction = (params?: any) => any;
type ActionFunction = (params?: any) => any;

interface Columns {
  cache_instance: any;
  instance: (that: ComponentProps<any>) => Columns;
  id: GlobalFunction;
  name: GlobalFunction;
  title: GlobalFunction;
  description: GlobalFunction;
  datetime: GlobalFunction;
  status: GlobalFunction;
  actions: ActionFunction;
}

interface Timestamps {
  create_time: string;
  update_time: string;
}

const columns: Columns = {
  cache_instance: undefined,
  instance: that => {
    columns.cache_instance = that;
    return columns;
  },
  // ID
  id: params => ({
    title: 'ID',
    dataIndex: 'id',
    width: 65,
    ...params,
  }),
  // 名字
  name: params => ({
    title: '名称',
    dataIndex: 'name',
    width: 90,
    ...params,
  }),
  // 标题
  title: params => ({
    title: '标题',
    dataIndex: 'title',
    width: 120,
    ...params,
  }),
  // 描述
  description: params => ({
    title: '描述',
    dataIndex: 'description',
    ...params,
  }),
  // 日期
  datetime: params => ({
    title: '日期',
    dataIndex: 'datetime',
    width: 166,
    render: (_: string, record: Timestamps) => (
      <>
        <div style={{ color: '#CCC' }}>{record.create_time || 'NULL'}</div>
        <div>{record.update_time || 'NULL'}</div>
      </>
    ),
    ...params,
  }),
  // 状态
  status: params => ({
    title: '状态',
    dataIndex: 'status',
    align: 'center' as const,
    width: 65,
    render: (text: number) => <Switch checked={!!text} size="small" />,
    ...params,
  }),
  // 操作（注意，此项是特殊的字段，你可能需要添加额外的元素）
  actions: params => ({
    title: '操作',
    width: 140,
    align: 'center' as const,
    fixed: 'right',
    ...params,
  }),
};

export default columns;

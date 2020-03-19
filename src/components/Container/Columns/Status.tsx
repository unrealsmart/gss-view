import React from 'react';
import { Switch } from 'antd';

const Status: React.FC = () => null;

Status.defaultProps = {
  title: '状态',
  dataIndex: 'status',
  align: 'center' as const,
  width: 65,
  render: (text: number) => <Switch checked={!!text} size="small" />,
};

export default Status;

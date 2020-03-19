import React from 'react';
import { ColumnProps } from 'antd/es/table';

interface NameProps extends ColumnProps<any> {
  //
}

const Name: React.FC<NameProps> = () => {
  // console.log('name');
  return null;
};

Name.defaultProps = {
  title: '名称',
  dataIndex: 'name',
  width: 90,
};

export default Name;

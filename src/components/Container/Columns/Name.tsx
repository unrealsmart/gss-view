import React, { useEffect, useState } from 'react';
import { ColumnProps } from 'antd/es/table';
import contrast from '@/components/Container/Columns/contrast';

interface NameProps extends ColumnProps<any> {
  [key: string]: any;
}

const Name: React.FC<NameProps> = props => {
  const [columns, setColumns]: any = useState({
    // abc: 1,
    // def: 3,
    // cn: 1,
    width: 100,
  });

  useEffect(() => {
    const difference = contrast(Name, columns, props);
    if (JSON.stringify(difference) !== '{}') {
      setColumns({ ...columns, ...difference });
      props.change('Name', difference);
    }
  }, [props]);

  return null;
};

Name.defaultProps = {
  title: '名称',
  dataIndex: 'name',
  width: 90,
};

export default Name;

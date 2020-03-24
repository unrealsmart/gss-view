import React, { useEffect, useState } from 'react';
import contrast from '@/components/Container/Columns/contrast';

interface IDProps {
  [key: string]: any;
}

const ID: React.FC<IDProps> = props => {
  const [columns, setColumns]: any = useState({
    // abc: 1,
    // def: 3,
    // cn: 1,
    // width: 99,
  });

  useEffect(() => {
    const difference = contrast(ID, columns, props);
    if (JSON.stringify(difference) !== '{}') {
      setColumns({ ...columns, ...difference });
      props.change('ID', difference);
    }
  }, [props]);

  return null;
};

ID.defaultProps = {
  title: 'ID',
  dataIndex: 'id',
  width: 75,
  abc: 1,
};

export default ID;

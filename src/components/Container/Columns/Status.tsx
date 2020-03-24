import React, { useEffect, useState } from 'react';
import { Switch } from 'antd';
import contrast from '@/components/Container/Columns/contrast';

interface StatusProps {
  [key: string]: any;
}

const Status: React.FC<StatusProps> = props => {
  const [columns, setColumns] = useState({
    render: (text: number) => {
      console.log(text);
      return (
        <Switch
          checked={!!text}
          size="small"
          onClick={() => {
            console.log('switch');
          }}
        />
      );
    },
  });

  useEffect(() => {
    const difference = contrast(Status, columns, props);
    if (Object.keys(difference).length) {
      const newValues = { ...columns, ...difference };
      setColumns(newValues);
      props.change('Status', newValues);
    }
  }, [props]);

  return null;
};

Status.defaultProps = {
  title: '状态',
  dataIndex: 'status',
  align: 'center' as const,
  width: 65,
  render: (text: number) => <Switch checked={!!text} size="small" />,
};

export default Status;

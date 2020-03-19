import React, { useEffect } from 'react';

interface IDProps {
  [key: string]: any;
}

const ID: React.FC<IDProps> = (props) => {
  useEffect(() => {
    const values = {
      abc: 1,
      def: 3,
      cn: 2,
    };

    const keys = Object.keys(values);
    const isChange = keys.filter(key => props[key] !== values[key]).length;
    if (isChange && props.change) {
      props.change('ID', values);
    }
  });

  return null;
};

ID.defaultProps = {
  title: 'ID',
  dataIndex: 'id',
  width: 65,
  abc: 1,
};

export default ID;

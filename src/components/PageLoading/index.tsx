import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons/lib';

interface PageLoadingProps {
  full?: boolean;
}

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
const PageLoading: React.FC<PageLoadingProps> = props => {
  const pageStyle = {
    height: props.full ? '100%' : '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={pageStyle}>
      <Spin indicator={<LoadingOutlined spin />} />
    </div>
  );
};
export default PageLoading;

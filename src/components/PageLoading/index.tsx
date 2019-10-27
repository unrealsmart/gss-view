import React from 'react';
import { Spin, Icon } from 'antd';

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
      <Spin indicator={<Icon type="loading" spin />} />
    </div>
  );
};
export default PageLoading;

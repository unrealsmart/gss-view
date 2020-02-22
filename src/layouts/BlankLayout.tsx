import React from 'react';
import { fullScreenLoading } from '@/utils/utils';

const Layout: React.FC = ({ children }) => (
  <>
    {children}
    {fullScreenLoading('leave')}
  </>
);

export default Layout;

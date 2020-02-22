import React from 'react';
import ReactDOM from 'react-dom';
import request from '@/utils/request';
import Termination from '@/components/Termination';
import { fullScreenLoading } from '@/utils/utils';
// import isJSON from 'is-json';
// import { getToken } from '@/utils/storage';

// export function onRouteChange({ location }: any) {
//   const adpToken = getToken();
//   const token = isJSON(adpToken) ? JSON.parse(adpToken) : {};
//   checkToken(token, location.pathname);
// }

export function render(oldRender: Function): void {
  request('main/config/adp').then(data => {
    if (data instanceof Response && !data.ok) {
      fullScreenLoading('leave');
      ReactDOM.render(<Termination response={data} />, document.getElementById('root'));
      return;
    }
    oldRender();
  });
}

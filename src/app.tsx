import React from 'react';
import ReactDOM from 'react-dom';
import request from '@/utils/request';
import Termination from '@/components/Termination';

function fetchADPConfig(oldRender: Function): void {
  request('/main/all-config/adp').then(data => {
    if (data) {
      localStorage.setItem('all-config-adp', JSON.stringify(data));
      oldRender();
    } else {
      ReactDOM.render(<Termination error={data} />, document.getElementById('root'));
    }
  });
}

// export function onRouteChange({ location, routes, action }: any) {
//   console.log(location);
//   console.log(routes);
//   console.log(action);
// }

export function render(oldRender: Function): void {
  request('/main/ping').then(data => {
    ReactDOM.render(<></>, document.getElementById('loading'));
    if (data instanceof Response) {
      ReactDOM.render(<Termination error={data} />, document.getElementById('root'));
    } else {
      fetchADPConfig(oldRender);
    }
  });
}

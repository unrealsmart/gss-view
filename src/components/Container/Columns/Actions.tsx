import React, { useEffect } from 'react';

interface ActionsProps {
  [key: string]: any;
}

const Actions: React.FC<ActionsProps> = (props) => {
  useEffect(() => {
    const values = {
      render: () => (
        <div>
          {props.children}
        </div>
      ),
    };

    const keys = Object.keys(values);
    const isChange = keys.filter(key => !props[key] || props[key].toString() !== values[key].toString()).length;
    if (isChange && props.change) {
      props.change('Actions', values);
    }
  });

  return null;
};

Actions.defaultProps = {
  title: '操作',
  width: 140,
  align: 'center' as const,
  fixed: 'right' as const,
  // render: (_: string, record: any) => (
  //   <>
  //     Action1
  //   </>
  // )
};

export default Actions;

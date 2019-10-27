import React from 'react';
import './AliyunOw.less';

interface AliyunOwProps {
  type?: string;
  style?: object;
}

const AliyunOw: React.FC<AliyunOwProps> = props => {
  const { type, style } = props;
  return (
    <i
      className={`aliyun-ow ${type}`}
      style={{
        ...style,
        position: 'relative',
        top: 1.5,
      }}
    />
  );
};

export default AliyunOw;

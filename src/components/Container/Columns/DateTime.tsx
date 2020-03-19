import React from 'react';

const DateTime: React.FC = () => null;

DateTime.defaultProps = {
  title: '日期',
  dataIndex: 'dateTime',
  width: 135,
  render: (_: string, record: Timestamps) => (
    <>
      <div style={{ color: '#CCC' }}>{record.create_time || 'NULL'}</div>
      <div>{record.update_time || 'NULL'}</div>
    </>
  ),
};

export default DateTime;

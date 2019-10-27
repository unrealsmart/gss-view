import React from 'react';
import styles from './index.less';

interface TerminationProps {
  error: {
    status?: number | string;
    statusText?: string;
  };
}

class Termination extends React.Component<TerminationProps> {
  state = {};

  render(): React.ReactNode {
    const { status, statusText } = this.props.error;

    return (
      <div className={styles.container}>
        <div className={styles.restrict}>
          <div className={styles.title}>ADP TERMINATION</div>
          <div className={styles.description}>
            <p>错误代码：{status}</p>
            <p>错误描述：{statusText}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Termination;

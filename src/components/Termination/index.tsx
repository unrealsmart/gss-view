import React from 'react';
import isJSON from 'is-json';
import styles from './index.less';

interface TerminationProps {
  response: Response;
}

interface TerminationState {
  message: string;
}

class Termination extends React.Component<TerminationProps, TerminationState> {
  state = {
    message: '',
  };

  componentDidMount(): void {
    const { response } = this.props;
    response.text().then(data => {
      const nd = isJSON(data) ? JSON.parse(data) : data;
      this.setState({
        message: data || nd.message,
      });
    });
  }

  render(): React.ReactNode {
    const { response } = this.props;
    const { status, statusText, url } = response;
    const { message } = this.state;
    const ellipsisStyle = {
      whiteSpace: 'nowrap' as const,
      maxWidth: 220,
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    };

    return (
      <div className={styles.container}>
        <div className={styles.restrict}>
          <div className={styles.title}>ADP TERMINATION</div>
          <div className={styles.description}>
            <p>错误代码：{status}</p>
            <p>错误描述：{statusText}</p>
            <p>请求地址：{url}</p>
            <p style={ellipsisStyle}>响应消息：{message}</p>
          </div>
          <div className={styles.refresh}>
            <a href={window.location.href}>刷新</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Termination;

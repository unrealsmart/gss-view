import React, { Component } from 'react';
import { Dropdown, Button, Menu, Checkbox } from 'antd';

interface ColumnVisibleProps {
  cache?: boolean;
  columns?: object[];
  disabled?: boolean;
  onChange?: (values: object[]) => void;
  [key: string]: any;
}

interface ColumnVisibleState extends GlobalClassState {
  visible?: boolean;
}

class ColumnVisible extends Component<ColumnVisibleProps, ColumnVisibleState> {
  static defaultProps = {
    cache: true,
    columns: [],
    disabled: false,
  };

  state = {
    visible: false,
  };

  componentDidMount(): void {
    //
  }

  componentWillUnmount(): void {
    clearInterval();
    clearTimeout();
    this.setState = () => {};
  }

  menuOverlay = (): React.ReactNode => {
    const { columns } = this.props;
    return (
      <Menu>
        {columns &&
          columns.map((item: any) => {
            const { show = true } = item;
            if (item.dataIndex === undefined) {
              return undefined;
            }
            return (
              <Menu.Item key={item.dataIndex} onClick={this.menuItemClick}>
                <Checkbox checked={show}>{item.title}</Checkbox>
              </Menu.Item>
            );
          })}
      </Menu>
    );
  };

  menuItemClick = (e: any) => {
    e.domEvent.preventDefault(); // clicking on the menu item triggered twice! WTF?
    const { columns = [] } = this.props;
    // const { columns = [] } = this.props;
    const newColumns = columns.map((item: any) => {
      const { show = true } = item;
      if (item.dataIndex === e.key) {
        return {
          ...item,
          show: !show,
        };
      }
      return item;
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(newColumns);
    }
  };

  visibleChange = (visible: boolean) => {
    this.setState({
      visible,
    });
  };

  render(): React.ReactNode {
    const { disabled } = this.props;
    const { visible } = this.state;

    return (
      <Dropdown
        overlay={this.menuOverlay()}
        visible={visible}
        onVisibleChange={this.visibleChange}
        disabled={disabled}
      >
        <Button icon="bars" />
      </Dropdown>
    );
  }
}

export default ColumnVisible;

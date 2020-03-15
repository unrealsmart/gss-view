import React, { Component } from 'react';
import { Button, Checkbox, Dropdown, Menu } from 'antd';
import { BarsOutlined } from '@ant-design/icons/lib';
import RouterTypes from 'umi/routerTypes';
import { ColumnProps } from 'antd/lib/table';

interface Props extends RouterTypes {
  columns?: ColumnProps<any>[];
  disabled: boolean;
  onChange: Function;
}

interface State {
  visible: boolean;
}

class FieldVisible extends Component<Props, State> {
  static defaultProps = {
    match: undefined,
    location: undefined,
    history: undefined,
    disabled: true,
    onChange: () => {},
  };

  state = {
    visible: false,
  };

  componentDidMount(): void {
  }

  // 存储可见字段
  saveColumnVisibleKeys = (values: object[]): void => {
    const { location }: RouterTypes = this.props;
    const columnVisibleKeys: string[] = [];
    values.forEach((item: { show?: boolean; dataIndex?: string }) => {
      const { show = true } = item;
      if (show && item.dataIndex !== undefined) {
        columnVisibleKeys.push(item.dataIndex);
      }
    });
    const cacheName = `dmcc${location.pathname.replace(/\//g, '-')}`;
    localStorage.setItem(cacheName, JSON.stringify(columnVisibleKeys));
  };

  menuItemClick = ({ key, domEvent }: any) => {
    domEvent.preventDefault(); // required, clicking on the menu item triggered twice! WTF?
    const { columns = [] } = this.props;
    const newColumns = columns.map((item: any) => {
      const { show = true } = item;
      return item.dataIndex === key ? { ...item, show: !show } : item;
    });
    const { onChange } = this.props;
    if (onChange) {
      this.saveColumnVisibleKeys(newColumns);
      onChange(newColumns);
    }
  };

  visibleChange = (visible: boolean) => {
    this.setState({ visible });
  };

  render(): React.ReactNode {
    const { columns, disabled } = this.props;
    const { visible } = this.state;

    return (
      <Dropdown
        overlay={(
          <Menu onClick={this.menuItemClick}>
            {columns && columns.map((item: any) => {
              const { show = true } = item;
              return item.dataIndex && (
                <Menu.Item key={item.dataIndex}>
                  <Checkbox checked={show}>{item.title}</Checkbox>
                </Menu.Item>
              );
            })}
          </Menu>
        )}
        visible={visible}
        onVisibleChange={this.visibleChange}
        disabled={disabled}
      >
        <Button icon={<BarsOutlined />} />
      </Dropdown>
    );
  }
}

export default FieldVisible;

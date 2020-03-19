import React, { Component, ReactElement } from 'react';
import Card, { CardProps } from 'antd/lib/card';
import { Row, Col, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import withRouter from 'umi/withRouter';
import RouterTypes from 'umi/routerTypes';
import isJSON from 'is-json';

interface ManageProps extends CardProps, RouterTypes {
  loading?: boolean;
  data: GlobalModelState;
  // columns: ColumnProps<any>[];
}

type SubComponents = {
  FieldVisible?: ReactElement;
  Fulltext?: ReactElement;
  Columns?: ReactElement;
  Create?: ReactElement;
  Demo?: ReactElement;
}

interface ManageState {
  columns: ColumnProps<any>[];
}

class Manage extends Component<ManageProps, ManageState> {

  state = {
    columns: [],
  };

  componentDidMount(): void {
    this.parseSubComponents();
    // 通过解析子组件获取字段信息
    // const { Columns } = this.parseSubComponents();
    // const columns = Columns && Columns.props.children.map((item: any) => {
    //   if (item.children) {
    //     return {
    //       ...item.props,
    //       render: item.children,
    //     }
    //   }
    //   return item.props;
    // });
    // console.log(Columns && Columns.props.children);
    // this.setState({ columns: this.loadColumnVisibleKeys(columns) });
  }

  // 解析子组件
  parseSubComponents = (): SubComponents => {
    const subComponents = {};
    const { children }: any = this.props;
    React.Children.forEach(children, (child: any) => {
      subComponents[child.type.name] = child;
    });
    return subComponents;
  };

  // 是否存在头部组件
  isExistHeader = () => {
    const condition = ['FieldVisible'];
    const subComponents = this.parseSubComponents();
    return condition.filter(value => subComponents[value]).length;
  };

  // 载入可见字段
  loadColumnVisibleKeys = (columns: any[]): object[] => {
    const { location } = this.props;
    const cacheName: string = `dmcc${location.pathname.replace(/\//g, '-')}`;
    const cacheValue: any = localStorage.getItem(cacheName);
    if (cacheValue && isJSON.strict(cacheValue)) {
      const cacheArray = JSON.parse(cacheValue);
      return columns.map((item: any) => {
        if (!cacheArray.includes(item.dataIndex) && item.dataIndex !== undefined) {
          return { ...item, show: false };
        }
        return { ...item, show: true };
      });
    }
    return columns;
  };

  // 净化字段
  purifyColumns = (): object[] => {
    const { columns = [] } = this.state;
    const newColumns: any[] = [];
    columns.forEach((item: any) => {
      if (item.children) {
        const { children, ...other } = item;
        newColumns.push({ ...other });
      } else {
        newColumns.push(item);
      }
    });
    return newColumns;
    // return columns.filter((item: any) => item.show || item.title !== '标题');
  };

  //
  showColumns = () => {
    const { Columns }: SubComponents = this.parseSubComponents();
    return Columns && React.cloneElement(Columns, {
      setColumns: (values: any) => {
        this.setState({ columns: values });
      },
    });
  };

  // 显示字段子组件
  showFieldVisible = () => {
    const { loading } = this.props;
    const { columns } = this.state;
    const { FieldVisible }: SubComponents = this.parseSubComponents();
    return FieldVisible && React.cloneElement(FieldVisible, {
      columns,
      history: this.props.history,
      location: this.props.location,
      disabled: loading,
      onChange: (values: any[]) => {
        this.setState({ columns: values });
      },
    })
  };

  // 显示全文搜索子组件
  showFulltext = () => {
    const { loading } = this.props;
    const { Fulltext }: SubComponents = this.parseSubComponents();
    return Fulltext && React.cloneElement(Fulltext, {
      disabled: loading,
    });
  };

  render(): React.ReactNode {
    const { data } = this.props;

    return (
      <Card bordered={false}>
        {this.showColumns()}
        <Row style={{ marginBottom: this.isExistHeader() ? 12 : 0 }}>
          <Col md={24} lg={12}>
            <Row gutter={6}>
              <Col>
                {this.showFieldVisible()}
              </Col>
              <Col>
                {this.showFulltext()}
              </Col>
            </Row>
          </Col>
          <Col md={24} lg={12}>
            123
          </Col>
        </Row>
        <Table dataSource={data.list} columns={this.purifyColumns()} />
      </Card>
    );
  }
}

export default withRouter(Manage);

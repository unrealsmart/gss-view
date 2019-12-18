import React, { Component } from 'react';
import {
  BackTop,
  Badge,
  Button,
  Card,
  Col,
  Icon,
  Popover,
  Rate,
  Row,
  Slider,
  Table,
  Tabs,
} from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import { EarnHotelModelItem } from '@/models/earn/hotel';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import rs from '@/utils/rs';
import { SliderValue } from 'antd/es/slider';
import request from '@/utils/request';
import { stringify } from 'qs';
import { EarnRoomModelItem } from '@/models/earn/room';
import classNames from 'classnames';
import { Chart, Geom, Label, Axis, Legend, Tooltip } from 'bizcharts';
import DataSet from '@antv/data-set';
import styles from './index.less';

interface HotelIndexProps {
  [key: string]: any;
}

interface HotelIndexState extends GlobalIndexClassState {}

class HotelIndex extends Component<HotelIndexProps, HotelIndexState> {
  state = {
    dataLoading: true,
    expandedRowData: {},
  };

  componentDidMount(): void {
    rs(this, 'earnHotel/search');
  }

  handleExpand = (expanded: boolean, record: EarnHotelModelItem) => {
    if (expanded) {
      const params = { hotel_id: record.hotel_id };
      request(`/earn/room?${stringify(params)}`).then((response: any) => {
        const { expandedRowData } = this.state;
        this.setState({
          expandedRowData: {
            ...expandedRowData,
            [record.hotel_id]: response.data,
          },
        });
      });
    }
  };

  render(): React.ReactNode {
    const { dataLoading, expandedRowData } = this.state;
    const { earnHotel } = this.props;
    const columns = [
      {
        title: '编码',
        dataIndex: 'code',
        width: 110,
      },
      {
        title: '价格更新',
        dataIndex: 'price_update',
        width: 80,
        align: 'center' as const,
        render(text: number) {
          return <Badge status={text ? 'success' : 'default'} />;
        },
      },
      {
        title: '库存更新',
        dataIndex: 'remains_update',
        width: 80,
        align: 'center' as const,
        render(text: number) {
          return <Badge status={text ? 'success' : 'default'} />;
        },
      },
      // {
      //   title: '门头',
      //   dataIndex: 'image_list',
      //   width: 115,
      //   render: (text: string, record: HotelModelItem) => {
      //     const previewImage = JSON.parse(text)[0];
      //     const imgStyle: CSSProperties = {
      //       width: '100%',
      //       height: '100%',
      //       objectFit: 'cover',
      //       boxShadow: '#c3c3c3 0 0 7px 0px',
      //       borderRadius: 3,
      //       overflow: 'hidden',
      //     };
      //     return (
      //       <div style={{ width: 115, height: 64 }}>
      //         <img
      //           src={previewImage ? previewImage.ImgURL : undefined}
      //           alt={record.name_cn}
      //           style={imgStyle}
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        title: '名称',
        dataIndex: 'name',
        render: (_: any, record: EarnHotelModelItem) => (
          <>
            <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 2 }}>
              {record.name_cn}
            </div>
            <div style={{ color: '#999', marginBottom: 6 }}>{record.name_en}</div>
            <div style={{ color: '#666' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Icon type="environment" style={{ marginRight: 3 }} />
                <span>{record.address_cn}</span>
              </div>
              <div style={{ color: '#999' }}>{record.address_en}</div>
            </div>
          </>
        ),
      },
      {
        title: '星级',
        dataIndex: 'star',
        width: 125,
        align: 'center' as const,
        render: (text: number) => <Rate value={text} disabled style={{ fontSize: 12 }} />,
      },
      {
        title: '省市/地区',
        dataIndex: 'city_id',
        width: 85,
        align: 'center' as const,
      },
      {
        title: '价格优势级别',
        dataIndex: 'price_advantage',
        width: 100,
        render: (_: void, record: EarnHotelModelItem) => {
          const marks = {
            0: '无',
            1: '小',
            2: '中',
            3: '大',
          };
          return (
            <Slider
              marks={marks}
              dots
              defaultValue={Number(record.advantage)}
              value={Number(record.advantage)}
              min={0}
              max={3}
              onChange={(value: SliderValue) => {
                if (!record.request_status) {
                  rs(this, 'earnHotel/update', {
                    id: record.id,
                    advantage: value,
                  });
                }
              }}
            />
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 100,
        render: (_: void, record: EarnHotelModelItem) => (
          <>
            <Link
              to={{
                pathname: '/system/administrator/detail',
                search: `id=${record.id}`,
              }}
            >
              详细
            </Link>
          </>
        ),
      },
    ];

    const expandedRowRender = (
      record: EarnHotelModelItem,
      index: number,
      indent: any,
      expanded: boolean,
    ) => {
      const expandedRowColumns = [
        {
          title: 'ID',
          dataIndex: 'id',
          width: 70,
        },
        {
          title: '房间编码',
          dataIndex: 'code',
          width: 120,
        },
        {
          title: '房间名称',
          dataIndex: 'name',
          width: 240,
          render: (_: void, cr: EarnRoomModelItem) => (
            <div>
              <div style={{ fontSize: 13 }}>{cr.name_cn}</div>
              <div style={{ color: '#ccc' }}>{cr.name_en}</div>
            </div>
          ),
        },
        {
          title: '价格政策',
          dataIndex: 'policy',
          render: (policy: object[]) => (
            <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'wrap' }}>
              {policy.map((item: any) => {
                const { date_price: datePrice = [] } = item;
                const content = (
                  <div className={styles.overlayContent}>
                    <Tabs tabPosition="left" size="small">
                      {datePrice.map((value: any, datePriceIndex: number) => {
                        const { condition = [], list = [] } = value;
                        const tab = (
                          <div>
                            <div>{condition.check_in_date}</div>
                            <div>{condition.check_out_date}</div>
                          </div>
                        );
                        const scale = {
                          update_time: {
                            type: 'timeCat',
                            mask: 'YYYY-MM-DD HH:mm:ss',
                          },
                        };
                        const label = {
                          offset: 24,
                          htmlTemplate(text: string): string {
                            const datetime = text.split(' ');
                            return `<div style="width:60px;text-align:center;"><div>${datetime[0]}</div><div>${datetime[1]}</div></div>`;
                          },
                        };
                        const ds = new DataSet();
                        const dv = ds
                          .createView()
                          .source(list)
                          .transform({
                            type: 'fold',
                            fields: ['remains', 'total_amount', 'markup'],
                            key: 'key',
                            value: 'value',
                            retains: ['update_time'],
                          });
                        dv.transform({
                          type: 'map',
                          callback(row: any) {
                            const map = {
                              remains: '库存',
                              total_amount: '总价格',
                              markup: '盈利价格',
                            };
                            return {
                              ...row,
                              key: map[row.key],
                            };
                          },
                        });
                        return (
                          <Tabs.TabPane tab={tab} key={datePriceIndex.toString()}>
                            <Chart height={260} data={dv} padding={46} scale={scale} forceFit>
                              <Legend position="top-center" offsetY={-6} />
                              <Axis name="update_time" label={label} />
                              <Axis name="value" />
                              <Tooltip crosshairs={{ type: 'y' }} />
                              <Geom
                                type="line"
                                shape="hv"
                                position="update_time*value"
                                size={1}
                                active={false}
                                color="key"
                              >
                                <Label content="value" offset={12} />
                              </Geom>
                              <Geom
                                type="point"
                                shape="hv"
                                position="update_time*value"
                                size={2}
                                active={false}
                                color="key"
                              />
                            </Chart>
                          </Tabs.TabPane>
                        );
                      })}
                    </Tabs>
                  </div>
                );
                return (
                  <Popover
                    key={item.id.toString()}
                    title="日期价格"
                    content={content}
                    arrowPointAtCenter
                    overlayClassName={styles.overlay}
                  >
                    <div className={styles.policyItem}>{item.id}</div>
                  </Popover>
                );
              })}
            </div>
          ),
        },
      ];
      return (
        <Table
          size="small"
          rowKey="id"
          className={classNames(styles.noBorder, styles.paginationCenter)}
          bordered={false}
          loading={expanded && !expandedRowData[record.hotel_id]}
          columns={expandedRowColumns}
          showHeader={false}
          pagination={false}
          dataSource={expandedRowData[record.hotel_id]}
        />
      );
    };

    const ds = new DataSet();
    const dv = ds
      .createView()
      .source(earnHotel.list)
      .transform({
        type: 'sort',
        callback(a: any, b: any) {
          return a.price_update - b.price_update;
        },
      });

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Row gutter={16} type="flex" justify="space-between" style={{ marginBottom: 12 }}>
            <Col>fulltext</Col>
            <Col>
              <Link to={{ pathname: '/system/administrator/create' }}>
                <Button type="primary" icon="plus">
                  新建
                </Button>
              </Link>
            </Col>
          </Row>
          <Table
            size="middle"
            bordered={false}
            loading={dataLoading}
            rowKey={(record: any) => record.id.toString()}
            dataSource={dv.rows}
            expandedRowRender={expandedRowRender}
            onExpand={this.handleExpand}
            expandRowByClick
            pagination={{
              ...earnHotel.page,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                rs(this, 'earnHotel/search', {
                  page,
                  page_size: pageSize,
                });
              },
              onShowSizeChange: (current, size) => {
                rs(this, 'earnHotel/search', {
                  page: current,
                  page_size: size,
                });
              },
            }}
            columns={columns}
          />
        </Card>
        <BackTop />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ earnHotel }: ConnectState) => ({
  earnHotel,
}))(HotelIndex);

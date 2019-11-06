import React, { Component } from 'react';
import { Card, Divider, Icon, Rate, Slider, Table } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import { EarnHotelModelItem } from '@/models/earn/hotel';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import rs from '@/utils/rs';
import { SliderValue } from 'antd/es/slider';

interface HotelIndexProps {
  [key: string]: any;
}

interface HotelIndexState extends GlobalIndexClassState {
  //
}

class HotelIndex extends Component<HotelIndexProps, HotelIndexState> {
  state = {
    dataLoading: true,
  };

  componentDidMount(): void {
    rs.reader(this, 'earnHotel/reader');
  }

  updatePriceAdvantage = (value: SliderValue) => {
    console.log(value);
  };

  render(): React.ReactNode {
    const { dataLoading } = this.state;
    const { earnHotel } = this.props;
    const columns = [
      // {
      //   title: 'ID',
      //   dataIndex: 'id',
      //   key: 'id',
      // },
      {
        title: '编码',
        dataIndex: 'code',
        key: 'code',
        width: 110,
      },
      // {
      //   title: '门头',
      //   dataIndex: 'image_list',
      //   key: 'image_list',
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
        key: 'name',
        width: 620,
        render: (_: any, record: EarnHotelModelItem) => (
          <>
            <div style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 2 }}>
              {record.name_cn}
            </div>
            <div style={{ color: '#999', marginBottom: 6 }}>{record.name_en}</div>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ color: '#666' }}>
              <Icon type="environment" style={{ marginRight: 2 }} />
              {record.address_cn}
              <div style={{ color: '#999' }}>{record.address_en}</div>
            </div>
          </>
        ),
      },
      {
        title: '星级',
        dataIndex: 'star',
        key: 'star',
        render: (text: number) => <Rate value={text} disabled style={{ fontSize: 12 }} />,
      },
      {
        title: '省市/地区',
        dataIndex: 'city_id',
        key: 'city_id',
      },
      {
        title: '价格优势',
        dataIndex: 'price_advantage',
        width: 160,
        key: 'price_advantage',
        render: (_: void, record: EarnHotelModelItem) => {
          const marks = {
            0: '无',
            1: '微弱',
            2: '中等',
            3: '大',
          };
          return (
            <Slider
              marks={marks}
              dots
              defaultValue={0}
              min={0}
              max={3}
              onChange={(value: SliderValue) => {
                rs.update(this, 'earnHotel/update', {
                  id: record.id,
                  advantage: value,
                });
              }}
            />
          )
        },
      },
      {
        title: '操作',
        dataIndex: 'action',
        width: 100,
        key: 'action',
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
            <Divider type="vertical" />
            <Link
              to={{
                pathname: '/earn/hotel/room',
                search: `id=${record.id}`,
              }}
            >
              房间
            </Link>
          </>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Table
            bordered={false}
            loading={dataLoading}
            rowKey={(record: any) => record.id.toString()}
            dataSource={earnHotel.list}
            pagination={{
              ...earnHotel.page,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                rs.reader(this, 'earnHotel/reader', {
                  page,
                  page_size: pageSize,
                });
              },
              onShowSizeChange: (current, size) => {
                rs.reader(this, 'earnHotel/reader', {
                  page: current,
                  page_size: size,
                });
              },
            }}
            columns={columns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ earnHotel }: ConnectState) => ({
  earnHotel,
}))(HotelIndex);

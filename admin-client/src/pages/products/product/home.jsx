import React, { Component } from 'react';
import { Card, Button, Icon, Select, Input, Table, message } from 'antd';
import throttle from 'lodash.throttle';

import LinkButton from '../../../components/link-button';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../../api/index';
import { PAGE_SIZE } from '../../../utils/Constants';
import memonyUtils from '../../../utils/memonyUtils';
const { Option } = Select;
/*
商品管理
*/
class ProductHome extends Component {
    state = {
        products: [],
        loading: false,
        total: 0,//商品的总数量
        searchType: 'productName',
        searchName: ''
    }

    updateStatus = throttle(async (productId, status) => {
        //计算更新后的值
        status = status === 1 ? 2 : 1;
        const result = await reqUpdateStatus(productId, status);
        if (result.status === 0) {
            message.success('更新商品状态成功')
            this.getProducts(this.pageNum);
        } else {
            message.error('更新商品状态失败')
        }
    }, 2000)

    initColums = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                width: 50,
                render: ({ _id, status }) => {
                    let btnText = '下架';
                    let text = '在售';
                    if (status === 1) {
                        btnText = '上架';
                        text = '已下架';
                    }
                    return (
                        <span>
                            <Button type="primary" onClick={() => { this.updateStatus(_id, status) }}>{btnText}</Button>
                            <span>{text}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width: 100,
                render: (products) => {
                    return (
                        <span>
                            <LinkButton onClick={() => {
                                memonyUtils.product = products
                                this.props.history.push('/product/detail')
                            }}>详情</LinkButton>
                            <LinkButton onClick={() => {
                                memonyUtils.product = products
                                this.props.history.push('/product/addupdate')
                            }}>修改</LinkButton>
                        </span>

                    )
                }
            },
        ];
    }
    //异步获取指定页码列表数据(可能带搜索)
    getProducts = async (pageNum) => {
        this.pageNum = pageNum;
        this.setState({ loading: true });
        const { searchName, searchType } = this.state;
        let result;
        if (!this.isSearch) {
            result = await reqProducts(pageNum, PAGE_SIZE);
        } else {
            result = await reqSearchProducts({
                pageNum,
                pageSize: PAGE_SIZE,
                searchName,
                searchType
            });
        }
        this.setState({ loading: false });
        if (result.status === 0) {
            const { total, list } = result.data;
            this.setState({
                products: list,
                total
            })
        } else {
            message.error('获取商品列表失败')
        }
    }

    componentDidMount() {
        this.getProducts(1);
    }

    componentWillMount() {
        this.initColums()
    }

    render() {
        const { products, loading, total, searchType, searchName } = this.state;
        const title = (
            <span>
                <Select
                    style={{ width: 200 }}
                    value={searchType}
                    onChange={(value) => { this.setState({ searchType: value }) }}>
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    placeholder="关键字"
                    style={{ width: 200 }}
                    value={searchName}
                    onChange={(event) => { this.setState({ searchName: event.target.value }) }} />
                <Button type="primary" onClick={() => {
                    this.isSearch = true
                    this.getProducts(1)
                }}>
                    搜索
                </Button>
            </span>
        )
        const extra = (
            <Button type="primary" onClick={() => {
                memonyUtils.product = {};
                this.props.history.push('/product/addupdate')
            }}>
                <Icon type="plus"></Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra} >
                <Table
                    columns={this.columns}
                    dataSource={products}
                    rowKey="_id"
                    bordered
                    loading={loading}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        total,
                        onChange: this.getProducts,
                        current: this.pageNum
                    }}
                />
            </Card>
        );
    }
}

export default ProductHome;
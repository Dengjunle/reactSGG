import React, { Component } from 'react';
import { Card, Button, Icon, Table, message, Modal } from 'antd';

import LinkButton from '../../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../../api/index';
import AddUpdateForm from './add-update-form';

import './category.less';

class Category extends Component {

    state = {
        categorys: [],//所有分类数组
        loading: false,
        showStatus: 0,//0 不显示 1 添加分类 2 修改分类 
    }

    //初始化
    initColums = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => <LinkButton onClick={()=>{
                    this.category = category;
                    this.setState({showStatus:2});
                }}>修改分类</LinkButton>
            },
        ];
    }

    //获取分类列表数据
    getCategorys = async () => {
        this.setState({ loading: true })
        const result = await reqCategorys();
        this.setState({ loading: false })
        if (result.status === 0) {
            const categorys = result.data;
            this.setState({ categorys })
        } else {
            message.error('获取分类列表失败')
        }
    }

    //显示添加修改分类框
    handleOk = () => {

        //进行表单验证
        this.form.validateFields(async (err, values) => {
            if (!err) {
                
                //验证通过后，得到输入数据
                const {categoryName} = values;

                const {showStatus} = this.state;
                let result;
                //发添加分类请求
                if(showStatus===1){
                    result = await reqAddCategory(categoryName)
                }else{
                    const categoryId = this.category._id;
                    result = await reqUpdateCategory({categoryId,categoryName})
                }
                this.form.resetFields()//重置输入数据
                this.setState({showStatus:0})
                const action = showStatus===1?'添加':'修改'
                //根据响应结果，做不同处理
                if(result.status === 0){
                    message.success(action+'分类成功')
                    this.getCategorys();
                } else {
                    message.error(action+'分类失败')
                }
            }
        });

    }

    //隐藏对话框
    handleCancel = () => {
        this.form.resetFields()//重置输入数据
        this.setState({ showStatus: 0 });
    }

    componentDidMount() {
        this.getCategorys();
    }

    componentWillMount() {
        this.initColums()
    }

    render() {
        //取出状态数据
        const { categorys, loading, showStatus } = this.state;

        //读取更新的分类名称
        const category = this.category||{}
        const extra = (
            <Button type="primary" onClick={() => { 
                this.category = {}
                this.setState({ showStatus: 1 }) 
                }}>
                <Icon type="plus"></Icon>
                添加
            </Button>
        )
        return (
            <Card extra={extra} >
                <Table
                    columns={this.columns}
                    dataSource={categorys}
                    rowKey="_id"
                    bordered
                    loading={loading}
                    pagination={{
                        defaultPageSize: 10,
                        showQuickJumper: true
                    }}
                />
                <Modal
                    title={showStatus === 1 ? '添加分类' : '修改分类'}
                    visible={showStatus !== 0}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    {/* 将子组件传递过来的form对象保存到当前组件对象上 */}
                    <AddUpdateForm setForm={form => this.form = form} categoryName={category.name}></AddUpdateForm>
                </Modal>
            </Card>
        );
    }
}

export default Category;
import React, { Component } from 'react';
import { Card, Button, Icon, message, Form, Input, Select } from 'antd';

import LinkButton from '../../../components/link-button'
import memonyUtils from '../../../utils/memonyUtils';
import { reqCategorys, reqAddUpdateProduct } from '../../../api/index';
import PicturesWall from './pictures-wall';
import RichTextEditor from './rich-text-editor';

const { Option } = Select;
//添加更新路由组件
class productAddUpdate extends Component {
    state = {
        categorys: []
    }

    constructor(props) {
        super(props);
        this.pwRef = React.createRef();
        this.editRef = React.createRef();
    }

    getCategory = async () => {
        const result = await reqCategorys()
        if (result.status === 0) {
            const categorys = result.data;
            this.setState({ categorys })
        }
    }
    //对价格进行自定义验证
    validatePrice = (rule, value, callback) => {
        if (!value) {
            callback('')
        } else if (value * 1 <= 0) {
            callback('价格必须大于0')
        } else {
            callback()
        }
    }

    handleSubmit = (event) => {
        //阻止默认行为
        event.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { name, desc, price, categoryId } = values;
                //收集已上传的图片文件名数组
                const imgs = this.pwRef.current.getImgs()
                //输入的商品详情的字符串
                const detail = this.editRef.current.getDetail()
                let product = {
                    name, desc, price, categoryId, imgs, detail
                }
                if (this.isUpdate) {
                    product._id = this.product._id;
                }
                const result = await reqAddUpdateProduct(product)
                if(result.status === 0){
                    message.success(`${this.isUpdate?'修改':'添加'}`+'成功');
                    this.props.history.goBack('/product')
                }else {
                    message.error(result.msg)
                }
            }
        });
    }

    componentDidMount() {
        this.getCategory()
    }
    componentWillMount() {
        this.product = memonyUtils.product;
        this.isUpdate = !!this.product._id;
    }

    render() {
        const { categorys } = this.state;
        const { getFieldDecorator } = this.props.form
        const { isUpdate, product } = this;
        console.log(product)
        const title = (
            <span>
                <LinkButton onClick={() => { this.props.history.goBack() }}>
                    <Icon type="arrow-left" ></Icon>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        const formLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 }
        }

        return (
            <Card title={title} >
                <Form {...formLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="商品名称">
                        {getFieldDecorator('name', {
                            initialValue: product.name || '',
                            rules: [
                                { required: true, message: '必须输入商品名称!' }
                            ],
                        })(<Input placeholder="商品名称" />)}
                    </Form.Item>
                    <Form.Item label="商品描述">
                        {getFieldDecorator('desc', {
                            initialValue: product.desc || '',
                            rules: [
                                { required: true, message: '必须输入商品描述!' }
                            ],
                        })(<Input placeholder="商品描述" />)}
                    </Form.Item>
                    <Form.Item label="商品价格">
                        {getFieldDecorator('price', {
                            initialValue: product.price || '',
                            rules: [
                                { required: true, message: '必须输入商品价格!' },
                                { validator: this.validatePrice }
                            ],
                        })(<Input placeholder="商品价格" type="number" addonAfter='元' />)}
                    </Form.Item>
                    <Form.Item label="商品名称">
                        {getFieldDecorator('categoryId', {
                            initialValue: product.categoryId || '',
                            rules: [
                                { required: true, message: '必须输入商品分类!' }
                            ],
                        })(<Select >
                            <Option value='' >未选择</Option>
                            {
                                categorys.map((c) => {
                                    return <Option value={c._id} key={c._id} >{c.name}</Option>

                                })
                            }
                        </Select>)}
                    </Form.Item>
                    <Form.Item label="商品图片">
                        <PicturesWall ref={this.pwRef} imgs={product.imgs}></PicturesWall>
                    </Form.Item>
                    <Form.Item label="商品详情" wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editRef} detail={product.detail}></RichTextEditor>
                    </Form.Item>


                    <Form.Item >
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(productAddUpdate);
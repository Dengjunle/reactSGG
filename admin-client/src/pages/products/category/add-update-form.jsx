import React, { Component } from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types'

/*
添加/修改分类的form组件
*/
class addUpdateForm extends Component {

    static propTypes = {
        setForm:PropTypes.func.isRequired,
        categoryName:PropTypes.string
    }

    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {categoryName} = this.props
        return (
            <Form>
                <Form.Item >
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: categoryName||'',
                            rules: [
                                { required: true, message: '分类名称必须输入' }
                            ]
                        })(
                            <Input type="text" placeholder="请输入分类名称" />
                        )}
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(addUpdateForm)
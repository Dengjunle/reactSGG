import React, { Component } from 'react';
import { Form, Select, Input } from 'antd';
import PropTypes from 'prop-types'

const { Option } = Select;
class UserForm extends Component {

    static propTypes = {
        roles: PropTypes.array.isRequired,
        user: PropTypes.object,
        setForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.setForm(this.props.form);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { roles, user } = this.props
        return (
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }}>
                <Form.Item label="用户名">
                    {getFieldDecorator('username', {
                        initialValue: user.username || '',
                        rules: [
                            { required: true, message: '用户名必须输入!' }
                        ],
                    })(<Input placeholder="请输入用户名" />)}
                </Form.Item>
                {
                    user._id ? null : (
                        <Form.Item label="密码">
                            {getFieldDecorator('password', {
                                initialValue: '',
                                rules: [
                                    { required: true, message: '密码必须输入!' }
                                ],
                            })(<Input type="password" placeholder="请输入密码" />)}
                        </Form.Item>
                    )
                }
                <Form.Item label="手机号">
                    {getFieldDecorator('phone', {
                        initialValue: user.phone || '',
                        rules: [
                            { required: true, message: '手机号必须输入!' }
                        ],
                    })(<Input type="tel" placeholder="请输入手机号" />)}
                </Form.Item>
                <Form.Item label="邮箱">
                    {getFieldDecorator('email', {
                        initialValue: user.email || '',
                    })(<Input type="email" placeholder="请输入邮箱" />)}
                </Form.Item>
                <Form.Item label="角色">
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id || '',
                        rules: [{ required: true, message: '角色必须选!' }],
                    })(
                        <Select
                        >
                            {
                                roles.map((item) => (
                                    <Option key={item._id} value={item._id}>{item.name}</Option>
                                ))

                            }
                        </Select>,
                    )}
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(UserForm);
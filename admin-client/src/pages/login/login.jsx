import React, { Component } from 'react';
import { Form, Icon, Input, Button, message } from 'antd';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { login } from '../../redux/action';
import storageUtils from '../../utils/storageUtils';
import memonyUtils from '../../utils/memonyUtils';
import { reqLogin } from '../../api/index';
import logo from '../../assets/images/logo.png';
import './login.less';

class Login extends Component {
    handleSubmit = e => {
        //阻止表单提交的默认行为
        e.preventDefault();
        // const values = this.props.form.getFieldsValue();
        // const username = this.props.form.getFieldValue('username');
        // const password = this.props.form.getFieldValue('password');

        // console.log(values, username, password)
        this.props.form.validateFields(async (err, { username, password }) => {
            if (!err) {
                this.props.login(username, password);
                // const result = await reqLogin(username, password);
                // console.log(result);
                // //登录成功
                // if(result.status === 0){
                //     //将user信息保存到local中
                //     const user = result.data;
                //     // localStorage.setItem('user_key',JSON.stringify(user));
                //     storageUtils.saveUser(user);
                //     memonyUtils.user = user;
                //     //跳转到管理界面
                //     this.props.history.replace('/');
                //     message.success('登陆成功!')
                // }else {
                //     message.error(result.msg)
                // }
            }
        });
    };

    componentDidMount() {

    }

    validatePwd = (rule, value, callback) => {
        /* 
        1). 必须输入
        2). 必须大于等于4位
        3). 必须小于等于12位
        4). 必须是英文、数字或下划线组成
        */
        value = value.trim();
        if (!value) {
            callback('密码是必须');
        } else if (value.length < 4) {
            callback('密码不能少于4位');
        } else if (value.length > 12) {
            callback('密码不能大于12位')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文，数字或下划线组成');
        } else {
            callback();
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        //如果存在用户信息直接跳转管理页面
        // const user = JSON.parse(localStorage.getItem('user_key') || '{}');
        // const user = memonyUtils.user;
        const user = this.props.user
        const errorMsg = user.errorMsg || null;
        if (user._id) {
            return <Redirect to='/' ></Redirect>
        }
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>后台管理系统</h1>
                </div>
                <div className="login-content">
                    {errorMsg?(<div style={{color:'red'}}>{errorMsg}</div>):''}
                    <h1>用户登录</h1>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {/* 1). 必须输入
                            2). 必须大于等于4位
                            3). 必须小于等于12位
                            4). 必须是英文、数字或下划线组成
                            */}
                            {
                                getFieldDecorator('username', {
                                    initialValue: '',
                                    rules: [
                                        { required: true, whitespace: true, message: '用户名是必须' },
                                        { min: 4, message: '用户名不能少于4位' },
                                        { max: 12, message: '用户名不能大于12位' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文，数字或下划线组成' }
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    initialValue: '',
                                    rules: [
                                        { validator: this.validatePwd }
                                    ],
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}

//理解Form组件：包含<Form>的组件
//利用Form.create()包装Form组件生成一个新的组件
//新组件会向form组件传递一个强大的属性：属性名：form，属性值对象


//高阶属性
// 定义：接收的参数是函数或者返回值是函数
// 常见的：数组遍历相关的方法/定时器/Promise
// 作用：实现一个更加强大的，动态功能

//高阶组件
// 本质是一个函数
// 函数接收一个组件，返回一个新的组件
// Form.create()就是一个高阶组件



const WrapperFrom = Form.create()(Login);
export default connect(
    state => ({
        user:state.user
    }),
    { login }
)(WrapperFrom);


/*
用户名/密码的的合法性要求
  1). 必须输入
  2). 必须大于等于4位
  3). 必须小于等于12位
  4). 必须是英文、数字或下划线组成
 */
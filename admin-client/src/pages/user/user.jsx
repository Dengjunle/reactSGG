import React, { Component } from 'react';
import { Card, Button, Table, message, Modal } from 'antd';

import { formateDate } from '../../utils/dateUtils';
import LinkButton from '../../components/link-button'
import { reqUsers, reqAddOrUpdateUser, reqDeleteUser } from '../../api/index';
import UserForm from './user-form';
import './user.less'

const { confirm } = Modal;
class User extends Component {

    state = {
        users: [],//用户列表
        roles: [],//角色列表
        loading: false,
        isShow: false
    }
    //显示添加用户界面
    showAdd = () => {
        this.user = null;
        this.setState({ isShow: true })
    }
    //修改用户信息
    updateUser = (user) => {
        this.user = user;
        this.setState({ isShow: true })
    }

    //确定信息
    addOrUpdateUser = () => {
        this.setState({ isShow: false })
        this.form.validateFields(async (err, values) => {
            if (!err) {
                const { email, phone, role_id, username } = values;
                let user = { email, phone, role_id, username }
                if (this.user) {
                    user._id = this.user._id
                } else {
                    user.password = values.password;
                }
                const result = await reqAddOrUpdateUser(user);
                const msg = this.user ? '修改' : '添加'
                if (result.status === 0) {
                    message.success(msg + '成功')
                    this.getUsers();
                } else {
                    message.error(msg + '失败')
                }
            }
        });
    }

    //删除用户信息
    deleteUser = (user) => {
        this.user = user
        confirm({
            title: `你确定要删除${user.username}?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id);
                if (result.status === 0) {
                    message.success('删除成功')
                    this.getUsers();
                } else {
                    message.error('删除失败')
                }
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });
    }

    getRole = (role_id) => {
        const { roles } = this.state;
        const role = roles.find((item) => item._id === role_id)
        return role.name;
    }

    initColumn = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: role_id => this.state.roles.find(role => role._id===role_id).name
                // render: (role_id) => (this.getRole(role_id) )
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => {
                    return (
                        <div>
                            <LinkButton onClick={() => { this.updateUser(user) }}>修改</LinkButton>
                            <LinkButton onClick={() => { this.deleteUser(user) }}>删除</LinkButton>
                        </div>
                    )
                }
            },
        ];
    }
    //获取用户列表信息和角色列表
    getUsers = async () => {
        this.setState({ loading: true })
        const result = await reqUsers()
        if (result.status === 0) {
            const users = result.data.users
            const roles = result.data.roles
            this.roleNames = roles.reduce((pre, item) => {
                pre[item._id] = item.name;
                return pre;
            }, [])
            this.setState({ users, roles })
        }
        this.setState({ loading: false })
    }

    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getUsers();
    }

    render() {
        const { users, roles, isShow } = this.state
        const user = this.user || {};
        const title = (
            <Button type="primary" onClick={this.showAdd}>
                添加用户
            </Button>
        )
        return (
            <div>
                <Card title={title} >
                    <Table
                        rowKey="_id"
                        columns={this.columns}
                        dataSource={users}
                        bordered
                    />
                </Card>
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    cancelText="取消"
                    okText="确定"
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({
                            isShow: false,
                        });
                    }}
                >
                    <UserForm setForm={(form) => this.form = form} roles={roles} user={user}></UserForm>
                </Modal>
            </div>
        );
    }
}

export default User;

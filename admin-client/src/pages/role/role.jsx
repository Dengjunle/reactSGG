import React, { Component } from 'react';
import { Card, Button, Table, message, Modal } from 'antd';


import { formateDate } from '../../utils/dateUtils';
import LinkButton from '../../components/link-button';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api/index';
import AddForm from './add-form';
import AuthForm from './auth-form';
import memonyUtils from '../../utils/memonyUtils';
import './role.less'

class Role extends Component {

    state = {
        roles: [],//角色列表
        loading: false,
        isShowAdd: false,
        isShowAuth: false
    }

    constructor (props) {
        super(props)
    
        this.authRef = React.createRef()
      }

    getRoles = async () => {
        this.setState({ loading: true })
        const result = await reqRoles();
        this.setState({ loading: false })
        if (result.status === 0) {
            const roles = result.data;
            this.setState({ roles })
        } else {
            message.error('获取角色列表失败')
        }

    }

    initColums = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
            {
                title: '操作',
                render: (role) => {
                    return (
                        <LinkButton onClick={() => {
                            this.showAuth(role)
                        }}>设置权限</LinkButton>
                    )
                }
            },
        ];
    }
    //显示权限设置界面
    showAuth = (role) => {  
        this.role = role
        this.setState({
            isShowAuth: true,
        });
    }

    addRole = () => {

        this.form.validateFields(async (err, values) => {
            if (!err) {
                const { roleName } = values
                const result = await reqAddRole(roleName);
                if (result.status === 0) {
                    this.getRoles();
                    message.success('添加成功');
                } else {
                    message.error('添加失败');
                }
                this.setState({
                    isShowAdd: false,
                });
            }
        });
    };
    //给角色授权
    updateRole = async() => {
        this.setState({
            isShowAuth: false,
        });
        const {role} = this
        role.menus = this.authRef.current.getMenus();
        role.auth_time = Date.now();
        role.auth_name = memonyUtils.user.username
        const result = await reqUpdateRole(role);
        if(result.status === 0){
            message.success('授权成功')
            this.getRoles()
        }else {
            message.error('授权失败')
        }
    }

    componentWillMount() {
        this.initColums()
    }

    componentDidMount() {
        this.getRoles()
    }


    render() {
        const { loading, roles, isShowAdd, isShowAuth } = this.state
        const role = this.role||{}
        const title = (
            <Button type="primary" onClick={() => {
                this.setState({
                    isShowAdd: true,
                });
            }}>
                创建角色
            </Button>
        )
        return (
            <Card title={title}  >
                <Table
                    columns={this.columns}
                    dataSource={roles}
                    loading={loading}
                    rowKey="_id"
                    bordered
                />
                <Modal
                    title="添加角色"
                    cancelText="取消"
                    okText="确定"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({
                            isShowAdd: false,
                        });
                        this.form.resetFields()
                    }}
                >
                    <AddForm setForm={(Form) => this.form = Form}></AddForm>
                </Modal>
                <Modal
                    title="设置角色权限"
                    cancelText="取消"
                    okText="确定"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false,
                        });
                    }}
                >
                    <AuthForm ref={this.authRef} role={role}></AuthForm>
                </Modal>
            </Card>
        );
    }
}

export default Role;
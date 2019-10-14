import React, { Component } from 'react';
import { Tree, Form, Input } from 'antd';
import PropTypes from 'prop-types'


import menuList from '../../config/menuConfig';

const { TreeNode } = Tree;

class AuthForm extends Component {
    static propTypes = {
        role: PropTypes.object
    }
    state = {
        checkedKeys: []
    };

    getMenus = () => this.state.checkedKeys

    /* 
    根据菜单配置生成<TreeNode>的数组
    */
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    {item.children ? this.getTreeNodes(item.children) : null}
                </TreeNode>
            )
            return pre
        }, [])
    }
    //进行勾选操作
    handleCheck = (checkedKeys) => {
        this.setState({ checkedKeys })
    }

    componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList);
        //根据传入角色的menus来更新checkedKeys状态
        const menus = this.props.role.menus
        this.setState({
            checkedKeys: menus
        })
    }
    /* 
      组件接收到新的标签属性时就会执行(初始显示时不会调用)
      nextProps: 接收到的包含新的属性的对象
      */
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }

    render() {
        const { role } = this.props
        const { checkedKeys } = this.state
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label宽度
            wrapperCol: { span: 15 }//右侧包裹的宽度
        }
        return (
            <div>
                <Form.Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Form.Item>
                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.handleCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}

export default AuthForm
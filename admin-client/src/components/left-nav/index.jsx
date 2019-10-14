import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';

import { connect } from 'react-redux';
import { setHeaderTitle } from '../../redux/action';
import logo from '../../assets/images/logo.png';
import './index.less';
import menuList from '../../config/menuConfig';
import memonyUtils from '../../utils/memonyUtils';

const { SubMenu } = Menu;

//左侧导航组件
class LeftNav extends Component {

    hasAuth = (item) => {
        //得到用户所有权限
        // const user = memonyUtils.user;
        const user = this.props.user
        const menus = user.role.menus;
        //如果当千用户是admin
        //如果item是公开的
        //当前用户由此item权限
        if (item.public || user.username === 'admin' || menus.indexOf(item.key) !== -1) {
            return true;
        } else if (item.children) {
            //如果当前用户有item的某个子节点的权限，当前item也应该显示
            const cItem = item.children.find(cItem => menus.indexOf(cItem.key) !== -1)
            return !!cItem;
        }
        return false;

    }

    //根据指定menu数据数组生成<Menu.Item>和<SubMenu>的数组 map + 函数递归
    getMenuNodes = (menuList) => {

        return menuList.reduce((pre, item) => {
            const path = this.props.location.pathname;
            // 判断当前用户是否有此item对应的权限
            if (this.hasAuth(item)) {
                if (!item.children) {


                    //找到path对应的item,更新headerTitle状态，值是item的title
                    if (item.key === path || path.indexOf(item.key) === 0) {
                        this.props.setHeaderTitle(item.title)
                    }

                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeaderTitle(item.title)}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    const Citem = item.children.find(citem => path.indexOf(citem.key) === 0);
                    if (Citem) {
                        this.openKey = item.key;
                    }
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre;
        }, [])
        // return menuList.map((item) => {
        //     const path = this.props.location.pathname;
        //     if (item.children) {
        //         const Citem = item.children.find(citem => path.indexOf(citem.key) === 0);
        //         if (Citem) {
        //             this.openKey = item.key;
        //             // console.log(item.key)
        //         }
        //         return (
        // <SubMenu
        //     key={item.key}
        //     title={
        //         <span>
        //             <Icon type={item.icon} />
        //             <span>{item.title}</span>
        //         </span>
        //     }
        // >
        //     {this.getMenuNodes(item.children)}
        // </SubMenu>
        //         )
        //     } else {
        //         // if(path===item.key){
        //         //     this.openKey = item.key;
        //         // }
        //         return (
        // <Menu.Item key={item.key}>
        //     <Link to={item.key}>
        //         <Icon type={item.icon} />
        //         <span>{item.title}</span>
        //     </Link>
        // </Menu.Item>
        //         )
        //     }
        // })
    }

    /*
    第一次render()之后执行一次
    执行异步任务：发ajax请求，启动定时器
    */
    componentDidMount() {

    }
    /*
    第一次render()之前执行一次
    为第一次render()做一些同步的准备工作
    */
    componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        //得到当前路由路径
        let selectKey = this.props.location.pathname;
        if (selectKey.indexOf('/product') === 0) {
            selectKey = '/product'
        }
        console.log('this.openKey', this.openKey)
        console.log('selectKey', selectKey)
        return (
            <div className="left-nav">
                <Link className="left-nav-link" to="/home">
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    selectedKeys={[selectKey]}
                    defaultOpenKeys={[this.openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }
}
/*
向外暴露 使用高阶组件withRouter()来包装非路由组件
新组件向LeftNav传递3个特别属性：history/location/match
结果：LeftNav可以操作路由相关语法
*/
export default connect(
    state => ({
        user:state.user
    }),
    { setHeaderTitle }
)(withRouter(LeftNav));

/*
1默认选中对应的menuItem
2有可能需要默认打开某个SubMenu：访问的是某个二级菜单项对应的router
*/
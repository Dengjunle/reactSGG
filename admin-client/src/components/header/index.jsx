import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Modal } from 'antd';

import { logout } from '../../redux/action';
import menuConfig from '../../config/menuConfig';
import memonyUtils from '../../utils/memonyUtils';
import storageUtils from '../../utils/storageUtils';
import { formateDate } from '../../utils/dateUtils';
import { reqWeather } from '../../api/index.js';
import LinkButton from '../../components/link-button';
import { connect } from 'react-redux';

import './index.less';

const { confirm } = Modal;

class Header extends Component {
    state = {
        currentTime: formateDate(Date.now()),
        dayPictureUrl: '',//天气图标
        weather: ''//天气内容
    }
    logout = () => {
        confirm({
            title: '你确定要退出吗?',
            content: '',
            onOk: () => {
                this.props.logout();
                // //内存中
                // storageUtils.removeUser();
                // //local
                // memonyUtils.user = {};

                // //跳转到登录界面
                // this.props.history.replace('/login');
            },
            onCancel: () => {
                console.log('Cancel');
            },
        });
    }

    // getTitle = () => {
    //     let title = '';
    //     let path = this.props.location.pathname
    //     menuConfig.forEach((item) => {
    //         if (item.key === path) {
    //             title = item.title;
    //         } else if (item.children) {
    //             let Citem = item.children.find((citem) => path.indexOf(citem.key) === 0);
    //             if (Citem) {
    //                 title = Citem.title;
    //             }
    //         }
    //     })
    //     return title;
    // }
    //获取天气信息
    getWeather = async () => {
        //发请求
        const { dayPictureUrl, weather } = await reqWeather('北京');
        //更新
        this.setState({ dayPictureUrl, weather })
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            let currentTime = formateDate(Date.now());
            this.setState({
                currentTime
            })
        }, 1000)
        //发送jsonp请求获取天气信息显示
        this.getWeather();
    }

    componentWillMount() {
        clearInterval(this.intervalId);
    }

    render() {
        // const user = memonyUtils.user;
        const user = this.props.user
        // const title = this.getTitle();
        const title = this.props.headerTitle;

        const { currentTime, dayPictureUrl, weather } = this.state;
        // console.log('dayPictureUrl', dayPictureUrl)
        // console.log('weather', weather)
        return (
            <div className="header">
                <div className="header-top">
                    欢迎，{user.username} &nbsp;&nbsp;
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        headerTitle: state.headerTitle,
        user:state.user
    }),
    {logout}
)(withRouter(Header));
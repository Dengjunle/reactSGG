import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import {connect} from 'react-redux';

import memonyUtils from '../../utils/memonyUtils';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';

import Home from '../home/home';
import Product from '../products/product/product';
import Detail from '../products/product/detail';
import Category from '../products/category/category';
import Charts from '../charts/charts';
import Role from '../role/role';
import User from '../user/user';

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
    render() {

        //读取保存的user，如果不存在，直接跳转到登录界面
        // const user = JSON.parse(localStorage.getItem('user_key') || '{}');
        // const user = memonyUtils.user;
        const user = this.props.user
        if(!user._id){
            return <Redirect to="/login" ></Redirect> 
        }
        return (
          <Layout style={{height:'100%'}}>
            <Sider>
                <LeftNav></LeftNav>
            </Sider>
            <Layout>
              <Header />
              <Content style={{background:'white' , margin:'20px'}}>
                <Switch>
                  <Route path="/home" component={Home} />
                  <Route path="/product" component={Product} />
                  <Route path="/category" component={Category} />
                  <Route path="/charts" component={Charts} />
                  <Route path="/role" component={Role} />
                  <Route path="/user" component={User} />
                  <Redirect to="/home" />
                </Switch>
              </Content>
              <Footer style={{textAlign:"center",color:"rgba(0,0,0,0.5)"}}>
                  推荐使用谷歌浏览器，可以获得更佳页面操作体验
              </Footer>
            </Layout>
          </Layout>
        );
    }
}

export default connect(
  state=>({
    user:state.user
  }),
  {}
)(Admin);
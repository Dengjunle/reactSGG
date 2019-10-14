import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import ProductHome from './home';
import ProductDetail from './detail';
import AddUpdate from './add-update';

import './product.less';

/**
 * 商品管理
 */
class Product extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path='/product' exact component={ProductHome} />
                    <Route path='/product/detail' component={ProductDetail} />
                    <Route path='/product/addupdate' component={AddUpdate} />
                    <Redirect to='/product' />
                </Switch>
            </div>
        );
    }
}

export default Product;
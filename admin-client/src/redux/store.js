/*
redux最核心的管理状态
*/
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducer';

export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
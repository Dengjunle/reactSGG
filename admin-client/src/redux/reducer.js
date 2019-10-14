/*
管理状态数据的reducer函数
*/
import { combineReducers } from 'redux'
import storageUtils from '../utils/storageUtils'
import { SET_HEADER_TITLE, RECEIVE_USER, SHOU_USER, LOGOUT } from './action-types'
/*
管理应用头部标题的reducer函数
*/
const initHeaderTit = '首页';
function headerTitle(state = initHeaderTit, action) {
    switch (action.type) {
        case SET_HEADER_TITLE:
            return action.data
        default:
            return state;
    }
}


/*
管理登陆用户的reducer函数
*/
const initUser = storageUtils.getUser();//读取local中保存user作为初始值
function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER:
            return action.data
        case LOGOUT:
            return {}
        case SHOU_USER:
            return { ...state, errorMsg: action.data }
        default:
            return state;
    }
}
//返回的是一个新的reducer函数
//总state的结构
/*
{
    headerTitle:'首页',
    user:{}
}
*/
const reducer = combineReducers({
    headerTitle,
    user
})

export default reducer
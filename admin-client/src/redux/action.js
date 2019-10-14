/*
包含n个用于创建action对象/函数的工厂函数（action creator）
*/
import { reqLogin } from '../api'
import { SET_HEADER_TITLE, RECEIVE_USER, SHOU_USER, LOGOUT } from './action-types';
import storageUtils from '../utils/storageUtils'
/*
设置头部标题
*/
export const setHeaderTitle = (headerTitle) => ({
    type: SET_HEADER_TITLE,
    data: headerTitle
})
/*
登录成功
*/
export const receiveUser = (user) => ({
    type: RECEIVE_USER,
    data: user
})
/*
登录失败
*/
export const showError = (msg) => ({
    type: SHOU_USER,
    data: msg
})
/*
退出登录
*/
export const logout = () => {
    storageUtils.removeUser();
    return {
        type: LOGOUT,
    }
}
/*
登录的异步action
*/
export function login(username, password) {
    return async (dispatch) => {
        //1.发登录的异步ajax请求
        const result = await reqLogin(username, password)
        //2.请求结束，分发同步action
        //成功了分发同步action
        if (result.status === 0) {
            const user = result.data;
            storageUtils.saveUser(user)
            dispatch(receiveUser(user))
        } else {//失败了分发同步action
            const msg = result.msg;
            dispatch(showError(msg))
        }

    }
}
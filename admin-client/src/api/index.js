/* 
包含应用中所有请求接口的函数: 接口请求函数
函数的返回值都是promise对象
*/
import service from './ajax';
import { message } from 'antd';
import jsonp from 'jsonp';



// const BASE = 'http://localhost:5000'
const BASE = ''

//请求登录
export function reqLogin(username, password) {
   return service.post(BASE + '/login', { username, password });
}

//发送jsonp请求得到天气信息
export const reqWeather = (city) => {

   //执行器函数：内部去执行异步任务
   //成功了调用resolve(),失败了不调用reject()，直接提示错误
   return new Promise((resolve, reject) => {
      const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
      jsonp(url, {}, (err, data) => {
         if (!err && data.error === 0) {
            const { dayPictureUrl, weather } = data.results[0].weather_data[0];
            resolve({ dayPictureUrl, weather });
         } else {
            message.error('获取天气信息失败');
         }
      })
   })
}

//获取分类列表
export const reqCategorys = () => service.get(BASE + '/manage/category/list')

//添加分类
export const reqAddCategory = (categoryName) => service.post(BASE + '/manage/category/add', { categoryName })

//修改分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => service.post(BASE + '/manage/category/update', {
   categoryId,
   categoryName
})

//根据分类id获取分类
export const reqCategory = (categoryId) => service.get(BASE + '/manage/category/info', {
   params: {
      categoryId
   }
})

//获取商品列表分页
export const reqProducts = (pageNum, pageSize) => service.get(BASE + '/manage/product/list', {
   params: {//包含所有的query参数
      pageNum,
      pageSize
   }
})

//根据Name/desc搜索产品分页列表
export const reqSearchProducts = ({
   pageNum,
   pageSize,
   searchName,
   searchType
}) => service.get(BASE + '/manage/product/search', {
   params: {
      pageNum,
      pageSize,
      [searchType]: searchName,
   }
})

//对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => service.post(BASE + '/manage/product/updateStatus', {
   productId,
   status
})


//删除图片
export const reqDeleteImg = (name) => service.post(BASE + '/manage/img/delete', {
   name
})

//对商品进行修改/添加
export const reqAddUpdateProduct = (product) => service.post(
   BASE + '/manage/product/' + (product._id ? 'update' : 'add'),
   product)

//查询角色列表
export const reqRoles = ()=>service.get(BASE + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName)=>service.post(BASE + '/manage/role/add',{
   roleName
})
//更新角色权限
export const reqUpdateRole = (role)=>service.post(BASE + '/manage/role/update',role);

//获取所有用户列表
export const reqUsers = ()=>service.get(BASE + '/manage/user/list')

//添加/修改用户
export const reqAddOrUpdateUser = (user)=>service.post(BASE + '/manage/user/'+ (user._id?'update':'add'),user)

//删除用户
export const reqDeleteUser = (userId)=>service.post(BASE + '/manage/user/delete',{
   userId
})
/*
包含n个日期时间处理的工具函数模块
*/

/*
  格式化日期
*/
export function formateDate(time) {
    if (!time) return ''
    let date = new Date(time)
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
        ' ' + padLeftZero(date.getHours() + '') + ':' + padLeftZero(date.getMinutes() + '') + ':' + padLeftZero(date.getSeconds() + '')
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}
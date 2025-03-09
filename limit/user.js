const joi = require('joi')

//string只能为字符串
// alphanum值为a-z A-Z 0-9
// min是最小长度，max是最大长度
// required是必填项
// pattern是正则表达式

const id = joi.required()
//对姓名的验证
const name = joi.string().pattern(/^(?:[\u4e00-\u9fa5]+)(?:●[\u4e00-\u9fa5]+)*$|^[a-zA-Z0-9]+\s?[\.·\-()a-zA-Z]*[a-zA-Z]+$/).required()
// 对邮箱的验证
const email = joi.string().pattern(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/).required()
// 对新旧密码的验证
const oldPassword = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()
const newPassword = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()

// 向外暴露这个限制条件
exports.password_limit = {
    //表示对req.body里面的数据进行验证
    body:{
        id,
        oldPassword,
		newPassword
    }
}

exports.name_limit = {
    //表示对req.body里面的数据进行验证
    body:{
        id,
        name
    }
}

exports.email_limit = {
    //表示对req.body里面的数据进行验证
    body:{
        id,
        email
    }
}

exports.fogetPassword_limit = {
    //表示对req.body里面的数据进行验证
    body:{
        id,
		newPassword
    }
}
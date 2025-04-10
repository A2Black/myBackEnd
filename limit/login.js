const joi = require('joi')

//string只能为字符串
// alphanum值为a-z A-Z 0-9
// min是最小长度，max是最大长度
// required是必填项
// pattern是正则表达式

//对账号的验证
const account = joi.string().alphanum().min(6).max(12).required()

//对密码的验证
const password = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()

// 向外暴露这个限制条件
exports.login_limit = {
    //表示对req.body里面的数据进行验证
    body:{
        account,
        password
    }
}
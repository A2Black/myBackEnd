// 导入express框架
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入expressJoi,对数据进行验证
const expressJoi = require('@escook/express-joi')

// 导入userinfo的路由处理模块
const userinfoHandler = require('../router_handle/userinfo.js')

// 导入name和email、password的验证规则、登陆页面的忘记密码验证规则
const {
    name_limit,email_limit,password_limit,fogetPassword_limit
} = require('../limit/user.js')



// 上传头像
router.post('/uploadAvatar',userinfoHandler.uploadAvatar)
// 绑定账号
router.post('/bindAccount',userinfoHandler.bindAccount)
// 修改用户密码
router.post('/changePassword',expressJoi(password_limit),userinfoHandler.changePassword)
// 获取用户信息
router.post('/getUserInfo',userinfoHandler.getUserInfo)
// 修改用户姓名
router.post('/changeName',expressJoi(name_limit),userinfoHandler.changeName)
// 修改用户性别
router.post('/changeSex',userinfoHandler.changeSex)
// 修改用户邮箱
router.post('/changeEmail',expressJoi(email_limit),userinfoHandler.changeEmail)
// 验证用户邮箱和密码verifyAccountAndEmail
router.post('/verifyAccountAndEmail',userinfoHandler.verifyAccountAndEmail)
// 登陆页面修改密码
router.post('/changePasswordInLogin',expressJoi(fogetPassword_limit),userinfoHandler.changePasswordInLogin)

// ...............................................................用户管理（增删改查）..................................................................................
// 添加管理员
router.post('/createAdmin',userinfoHandler.createAdmin)
// 获取管理员列表 getAdminList
router.post('/getAdminList',userinfoHandler.getAdminList)
// 编辑管理员信息 editAdminInfo
router.post('/editAdminInfo',userinfoHandler.editAdminInfo)

// 向外暴露路由
module.exports = router
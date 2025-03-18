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
// 降级管理员身份 changeAdminToUser
router.post('/changeAdminToUser',userinfoHandler.changeAdminToUser)
// 对普通用户赋权 升级成为管理员 changeUserToAdmin
router.post('/changeUserToAdmin',userinfoHandler.changeUserToAdmin)
// 通过账号对用户进行搜索 searchUser
router.post('/searchUser',userinfoHandler.searchUser)
// 通过部门对用户进行搜索 searchUserByDepartment
router.post('/searchUserByDepartment',userinfoHandler.searchUserByDepartment)
// 冻结用户
router.post('/banUser',userinfoHandler.banUser)
// 解冻用户 hotUser
router.post('/hotUser',userinfoHandler.hotUser)
// 获取冻结用户列表 getBanList
router.post('/getBanList',userinfoHandler.getBanList)
// 删除用户 deleteUser
router.post('/deleteUser',userinfoHandler.deleteUser)
// 获取对应身份的一个总人数 getAdminListLength
router.post('/getAdminListLength',userinfoHandler.getAdminListLength)
// 监听换页并返回数据 returnListData
router.post('/returnListData',userinfoHandler.returnListData)


// 向外暴露路由
module.exports = router
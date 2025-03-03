// 导入express框架
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入expressJoi,对数据进行验证
const expressJoi = require('@escook/express-joi')

// 导入userinfo的路由处理模块
const userinfoHandler = require('../router_handle/userinfo.js')

// 上传头像
router.post('/uploadAvatar',userinfoHandler.uploadAvatar)
// 绑定账号
router.post('/bindAccount',userinfoHandler.bindAccount)
// 向外暴露路由
module.exports = router
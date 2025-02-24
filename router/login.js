// 登录注册模块路由
// 导入express框架
const express = require('express')

// 使用express框架的路由
const router = express.Router()
// 导入login的路由处理模块
const loginHandler = require('../router_handle/login.js')

router.post('/register',loginHandler.register)

router.post('/login',loginHandler.login)

// 对外暴露路由
module.exports = router
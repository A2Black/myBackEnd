// 部门消息后端模块
// 引入express
const express = require('express')
// 使用express框架的路由
const router = express.Router()
// 导入department_msg路由处理模块
const departmentMsgHandler = require('../router_handle/department_msg')

// 获取部门消息id list
router.post('/getDepartmentMsg', departmentMsgHandler.getDepartmentMsg)
// 获取部门消息
router.post('/getDepartmentMsgList', departmentMsgHandler.getDepartmentMsgList)
// 返回用户的阅读列表及状态
router.post('/getReadListAndStatus', departmentMsgHandler.getReadListAndStatus)
// 用户点击消息后,对read_list内的数据进行删减 参数 消息的readid 以及 用户的id
router.post('/clickDelete', departmentMsgHandler.clickDelete)
// 把新发布文章的id插入到当前所属部门的用户的read_list中 
router.post('/changeUserReadList', departmentMsgHandler.changeUserReadList)
// 把删除的文章的id从当前所属部门的用户的read_list中删除
router.post('/changeUserReadListButDelete', departmentMsgHandler.changeUserReadListButDelete)

// 向外导出路由
module.exports = router
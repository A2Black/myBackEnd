// 导入express框架
const express = require('express')
//创建express的实例
const app = express()
// 导入body-parser
var bodyParser = require('body-parser')

// 导入cors
const cors = require('cors')
// 全局挂载
app.use(cors())

// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。
const multer = require("multer");
// 在server服务端下新建一个public文件，在public文件下新建upload文件用于存放图片，新建upload文件用于存放图片
const upload = multer({dest: './public/upload'})
// 使用这个中间件
app.use(upload.any())
// 静态托管
app.use(express.static("./public"));

// parse application/x-www-form-urlencoded
// 当extend为false时,值为数组或字符串,当extend为true时,值可以为任意类型
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
// 用于处理json数据格式的方法
app.use(bodyParser.json())

//注册错误中间件
app.use((req,res,next)=>{
	// status=0为成功，=1为失败，默认为1，方便处理失败情况
	res.cc = (err,status = 1)=>{
		res.send({
			status,
			//判断这个err是错误对象还是字符串
			message:err instanceof Error ? err.message : err,

		})
	}
	next()
})

//导入jwt配置
// const jwtconfig = require('./jwt_config/index.js')
// const {expressjwt:jwt} = require('express-jwt')
// app.use(jwt({
// 	secret:jwtconfig.jwtSecretKey,
// 	algorithms:['HS256']   //指定签名算法为HS256
// }).unless({
// 	path:[/^\/api\//]      //排除需要免认证的路由
// }))

const loginRouter = require('./router/login.js')
const Joi = require('joi')
app.use('/api',loginRouter)
const userRouter = require('./router/userinfo.js')
app.use('/user',userRouter)
const setRouter = require('./router/setting.js')
app.use('/set',setRouter)
const productRouter = require('./router/product.js')
app.use('/pro',productRouter)
const messageRouter = require('./router/message.js')
app.use('/msg',messageRouter)
const fileRouter = require('./router/file.js')
app.use('/file',fileRouter)

//对不符合joi规则的情况报错
app.use((err,req,res,next)=>{
	if(err instanceof Joi.ValidationError) {
		res.send({
			status: 1,
			message:'输入的数据不符合验证规则'
		})
	}
})

// 绑定和侦听指定的主机和端口
app.listen(3007, () => {
	console.log('http://127.0.0.1:3007')
})
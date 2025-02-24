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
const jwtconfig = require('./jwt_config/index.js')
const {expressjwt:jwt} = require('express-jwt')
app.use(jwt({
	secret:jwtconfig.jwtSecretKey,
	algorithms:['HS256']   //指定签名算法为HS256
}).unless({
	path:[/^\/api\//]      //排除需要免认证的路由
}))

const loginRouter = require('./router/login.js')
app.use('/api',loginRouter)

// 对不符合joi规则的情况报错
app.use((err,req,res,next)=>{
	if(err instanceof Joi.ValidationError) return res.cc(err)
})

// 绑定和侦听指定的主机和端口
app.listen(3007, () => {
	console.log('http://127.0.0.1:3007')
})
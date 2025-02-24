// 导入数据库
const db = require('../db/index.js')
// 导入bcrypt加密中间件，用来加密密码
const bcrypt = require('bcryptjs')
// 导入jwt，用于生成token
const jwt = require('jsonwebtoken')
// 导入jwt配置文件，用于加密和解密
const jwtconfig = require('../jwt_config/index.js')


exports.register = (req,res) =>{
	// req是前端传过来的数据,也就是request,res是返回给前端的数据,也就是result
	const reginfo = req.body
	// 第一步,判断账号或密码是否为空
	if(!reginfo.account || !reginfo.password){
		return res.send({
			status:1,
			message:'账号或密码不能为空!'
		})
	}
	// 第二步,判断前端传送过来的账号是否已经存在于数据表中
	// 需要用到mysql的select语句
	const sql = 'select * from users where account = ?'
	// 第一个参数sql1是执行第16行语句,第二个参数是前端传进来的,第三个是处理函数,用于处理结果,err是返回错误信息的参数,results是返回处理结果的参数
	db.query(sql,reginfo.account,(err,results)=>{
		if(results.length>0){
			return res.send({
				status:1,
				message:'账号已存在'
			})
		}
		// 第三步,对密码进行加密
		// 需要使用加密中间件bcrypt.js
		// bcrypt.hashSync()中,第一个参数是前端传进来的密码,第二个参数是加密后的长度
		reginfo.password = bcrypt.hashSync(reginfo.password,10)
		// 第四步,把账号和密码插入到users表里面
		const sql1 = 'insert into users set ?'
		// 注册身份
		const identity = '用户'
		// 创建时间
		const creat_time = new Data()
		db.query(sql1,{
			account:reginfo.account,
			password:reginfo.password,
			// 身份
			identity,
			// 创建时间
			creat_time,
			// 初始未冻结状态为0
			status:0
		},(err,results)=>{
			// 第一个情况,如果插入失败
			// affectedRows为影响的行数,如果插入失败,那就没有影响到users表的行数,也就是行数不唯一
			if(results.affectedRows !== 1){
				return res.send({
					status:1,
					message:'注册账号失败'
				})
			}
			res.send({
				status:1,
				message:'注册账号成功'
			})
		})
	})
}

exports.login = (req,res) =>{
	const loginfo = req.body
	// 第一步，查看数据表中有没有前端传过来的数据
	const sql = 'select * from users where account = ?'
	db.query(sql,loginfo.account,(err,results)=>{
		// 执行sql语句语句失败的情况，一般是数据库断开的情况会执行失败
		if(err) return res.cc(err)
		//如果返回的查询结果长度不为1，提示登录失败
		if(results.length !== 1) return res.cc('登录失败')
		// 第二步，登录没有失败，对前端传过来的密码进行解密
		const compareResult = bcrypt.compareSync(loginfo.password,results[0].password)
		if(!compareResult ){
			return res.cc('登陆失败')
		}
		// 第三步，判定账号是否冻结
		if(results[0].status == 1){
			return res.cc('账号被冻结')
		}
		//第四步，生成返回给前端的token
		// 剔除加密后的密码、头像、创建时间、更新时间
		const user = {
			...results[0],
			password:' ',
			imageUrl:' ',
			create_time:' ',
			update_time:' '
		}
		//设置token的有效时长,有效时长为7h
		const tokenStr = jwt.sign(user,jwtconfig.jwtSecretKey,{
			expiresIn:'7h'
		})
		res.semd({
			results:results[0],
			status:0,
			message:'登录成功',
			token:'Bearer' + tokenStr,
		})
	})
}
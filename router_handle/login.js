// 导入数据库
const db = require('../db/index.js')

exports.register = (req,res) =>{
	// req是前端传过来的数据,也就是request,res是返回给前端的数据,也就是result
	const reginfo = req.body
	// 第一步,判断账号或密码是否为空
	if(!reginfo.account || !reginfo.password){
		return res.send({
			statusL:1,
			message:'账号或密码不能为空!'
		})
	}
	// 第二部,判断前端传送过来的账号是否已经存在于数据表中
	// 需要用到mysql的select语句
	const sql = 'select * from users where account = ?'
	// 第一个参数sql1是执行第16行语句,第二个参数是前端传进来的,第三个是处理函数,用于处理结果,err是返回错误信息的参数,results是返回处理结果的参数
	db.query(sql,reginfo.account,(err,results)=>{
		if(results.length>0){
			return res.send({
				statusL:1,
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
					statusL:1,
					message:'注册账号失败'
				})
			}
			res.send({
				statusL:1,
				message:'注册账号成功'
			})
		})
	})
}

exports.login = (req,res) =>{
	res.send('登录')
}
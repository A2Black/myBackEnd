// 导入数据库
const db = require('../db/index.js')
// 导入bcrypt加密中间件，用来加密密码
const bcrypt = require('bcryptjs')
// 导入node.js的crypto库用于生成uuid
const crypto = require('crypto')
// 导入fs用于处理文件
fs = require('fs')

// 上传头像的接口
exports.uploadAvatar = (req,res)=>{
	// 生成唯一标识
	const onlyId = crypto.randomUUID()
	// 保存上传时的文件名
	let oldName = req.files[0].filename;
	// 文件在服务器中的名字
	let newName = Buffer.from(req.files[0].originalname,'latin1').toString('utf8')   //防止乱码
	fs.renameSync('./public/upload/'+ oldName,'./public/upload/' + newName)
	const sql = 'insert into image set ?'
	db.query(sql,{
		image_url:`http://127.0.0.1:3007/upload/${newName}`,
		onlyId
	},(err,result)=>{
		if(err) return res.cc(err)
		res.send({
			onlyId,
			status:0,
			url:'http://127.0.0.1:3007/upload/' + newName
		})
	})
}

// 绑定账号的接口
exports.bindAccount = (req,res)=>{
	// 需要从前端传进来的三个参数
	const {
		account,
		onlyId,
		url
	} = req.body
	// 用onlyId代替url与account绑定
	const sql = 'update image set account = ? where onlyId = ?'
	db.query(sql,[account,onlyId],(err,result)=>{
		if(err) return res.cc(err)
		if(result.affectedRows == 1){
			const sql1 = 'update users set image_url = ? where account = ?'
			db.query(sql1,[url,account],(err,result)=>{
				if(err) return res.cc(err)
				res.send({
					status:0,
					message:"修改成功"
				})
			})
		}
	})
}

// 获取用户信息   根据接受参数id
exports.getUserInfo = (req,res)=>{
	const sql = 'select * from users where id = ?'     //是从users表里面查找符合条件的信息
	db.query(sql,req.body.id,(err,result)=>{
		if(err) return res.cc(err)
		res.send(result)
	})
}

// 修改用户姓名 接收参数 id， name
exports.changeName = (req,res)=>{
	// 解构赋值
	const {
		id,
		name
	} = req.body
	const sql = 'update users set name = ? where id = ?'
	db.query(sql,[name,id],(err,result)=>{
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:"修改成功"
		})
	})
}

// 修改用户性别    接收参数为id，sex
exports.changeSex = (req,res)=>{
	// 解构赋值
	const {
		id,
		sex
	} = req.body
	const sql = 'update users set sex = ? where id = ?'
	db.query(sql,[sex,id],(err,result)=>{
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:"修改成功"
		})
	})
}

// 修改用户邮箱 接收参数为id，email
exports.changeEmail = (req,res)=>{
	// 解构赋值
	const {
		id,
		email
	} = req.body
	const sql = 'update users set email = ? where id = ?'
	db.query(sql,[email,id],(err,result)=>{
		if(err) return res.cc(err)
		res.send({
			status:0,
			message:"修改成功"
		})
	})
}

// 修改密码 三个参数：旧密码 oldPassword 新密码 newPasswo 通过用户id查找旧密码
exports.changePassword = (req,res)=>{
	const sql = 'select password from users where id = ?'
	db.query(sql,req.body.id,(err,result)=>{
		if(err) return res.cc(err);
		//bcrypt 使用这个中间件的比较方法
		const compareResult = bcrypt.compareSync(req.body.oldPassword,result[0].password);
		if(!compareResult){
			res.send({
				status:1,
				message:"旧密码错误"
			})
		}
		// 加密新密码
		req.body.newPassword = bcrypt.hashSync(req.body.newPassword,10)
		const sql1 = 'update users set password = ? where id = ?'
		db.query(sql1,[req.body.newPassword,req.body.id],(err,result)=>{
			if(err) return res.cc(err);
			res.send({
				status:0,
				message:"修改成功"
			})
		})
	})
}
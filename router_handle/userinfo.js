// 导入数据库
const db = require('../db/index.js')
// 导入bcrypt加密中间件，用来加密密码
const bcrypt = require('bcryptjs')
// 导入node.js的crypto库用于生成uuid
const crypto = require('crypto')
const { resourceLimits } = require('worker_threads')
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
		result[0].password = ''
		res.send(result[0])
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
			return res.send({
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

// 验证账户和邮箱是否一致 email account
exports.verifyAccountAndEmail = (req,res)=>{
	const {
		account,
		email
	} = req.body;
	const sql = 'select * from users where account = ?';
	db.query(sql,account,(err,result)=>{
		if(err) return res.cc(err);
		// res.send(result[0])
		if(email === result[0].email){
			res.send({
				status:0,
				message:"查询成功",
				id:result[0].id,
			})
		}else{
			res.send({
				status:1,
				message:"查询失败"
			})
		}
	})
}

// 登录页面修改密码 id newPassword
exports.changePasswordInLogin = (req,res) => {
	req.body.newPassword = bcrypt.hashSync(req.body.newPassword,10)
	const user = req.body;
	const sql = 'update users set password = ? where id = ?';
	db.query(sql,[user.newPassword,user.id],(err,result)=>{
		if(err) return res.cc(err);
		res.send({
			status:0,
			message:"密码修改成功"
		})
	})
}




// ...............................................................用户管理（增删改查）..................................................................................
// 添加管理员
exports.createAdmin = (req,res) => {
	// 需要前端传进来的参数
	const {
		account,
		password,
		name,
		sex,
		department,
		email,
		identity,
	} = req.body
	// 判断账号是否存在于数据库中
	const sql = 'select * from users where account = ?'
	db.query(sql,account,(err,result)=>{
		// 判断账号是否存在
		if(result.length>0){
			return res.send({
				status:1,
				message:'账号已存在'
			})
		}
		// 如果账号不存在就创建账号，并对密码进行加密
		const hashpassword = bcrypt.hashSync(password,10)
		// 第四步,把账号和密码插入到users表里面
		const sql1 = 'insert into users set ?'
		// 创建时间
		const creat_time = new Date()
		db.query(sql1,{
			account,
			password:hashpassword,
			name,
			sex,
			department,
			email,
			identity,
			// 创建时间
			creat_time,
			// 初始未冻结状态为0
			status:0
		},(err,result)=>{
			// 第一个情况,如果插入失败
			// affectedRows为影响的行数,如果插入失败,那就没有影响到users表的行数,也就是行数不唯一
			if(result.affectedRows !== 1){
				return res.send({
					status:1,
					message:'添加管理员失败！'
				})
			}
			res.send({
				status:0,
				message:'添加管理员成功！'
			})
		})
	})
}

// 获取管理员列表  参数是前端传进来的identity
exports.getAdminList = (req,res) => {
	const sql = 'select * from users where identity = ?'
	db.query(sql,req.body.identity,(err,result)=>{
		if(err) return res.cc(err);
		result.forEach((e)=>{
			e.password = '',
			e.creat_time = '',
			e.image_url = '',
			e.status = ''
		})
		res.send(result)
	})
}

// 编辑管理员账号信息
exports.editAdminInfo = (req, res) => {
	const {
		id,
		name,
		sex,
		email,
		department
	} = req.body
	const date = new Date()
	const sql0 = 'select department from users where id = ?'
	db.query(sql0, id, (err, result) => {
		if (result[0].department == department) {
			// 修改的内容
			const updateContent = {
				id,
				name,
				sex,
				email,
				department,
				update_time: date,
			}
			const sql = 'update users set ? where id = ?'
			db.query(sql, [updateContent, updateContent.id], (err, result) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					message: '修改管理员信息成功'
				})
			})
		} else {
			// 修改的内容
			const updateContent = {
				id,
				name,
				sex,
				email,
				department,
				update_time: date,
				read_list: null,
				read_status: 0
			}
			const sql = 'update users set ? where id = ?'
			db.query(sql, [updateContent, updateContent.id], (err, result) => {
				if (err) return res.cc(err)
				res.send({
					status: 0,
					message: '修改管理员信息成功'
				})
			})
		}
	})

}

// 对管理员取消赋权  降级成为普通用户 参数id
exports.changeAdminToUser = (req,res) => {
	const identity = "用户"
	const sql = 'update users set identity = ? where id = ?'
	db.query(sql,[identity,req.body.id],(err,result)=>{
		if(err) return res.cc(err);
		res.send({
			status:0,
			message:"管理员降级成功！"
		})
	})
}

// 对普通用户赋权 升级成为管理员 参数id identity
exports.changeUserToAdmin = (req,res) => {
	const date = new Date()
	const sql = 'update users set identity = ?,update_time = ? where id = ?'
	db.query(sql,[req.body.identity, date, req.body.id],(err,result)=>{
		if(err) return res.cc(err);
		res.send({
			status:0,
			message:"对普通用户赋权成功！"
		})
	})
}

// 通过账号对用户进行搜索  参数为account
exports.searchUser = (req,res) => {
	const sql = 'select * from users where account = ? and identity = ?'
	db.query(sql,[req.body.account, req.body.identity],(err,result)=>{
		if(err) return res.cc(err);
		result.forEach((e)=>{
			e.password = '',
			e.creat_time = '',
			e.image_url = '',
			e.status = ''
		})
		res.send(result)
	})
}

// 通过选择部门对用户进行搜索  参数为department
exports.searchUserByDepartment = (req,res) => {
	const sql = 'select * from users where department = ? and identity = "用户"'
	db.query(sql,req.body.department,(err,result)=>{
		if(err) return res.cc(err);
		result.forEach((e) => {
			e.password = ''
			e.image_url = ''
		})
		res.send(result)
	})
}

// 冻结用户 参数id 把status置为1 
exports.banUser = (req,res) => {
	const status = 1
	const sql = 'update users set status = ? where id = ?'
	db.query(sql,[status,req.body.id],(err,result)=>{
		if(err) return res.cc(err);
		res.send({
			status:0,
			message:"冻结成功！"
		})
	})
}

// 解冻用户 参数id 把status置为0
exports.hotUser = (req,res) => {
	const status = 0
	const sql = 'update users set status = ? where id = ?'
	db.query(sql,[status,req.body.id],(err,result)=>{
		if(err) return res.cc(err);
		res.send({
			status:0,
			message:"解冻成功！"
		})
	})
}

// 获取冻结用户列表
exports.getBanList = (req,res) => {
	const sql = 'select * from users where status = "1"'
	db.query(sql,(err,result)=>{
		if(err) return res.cc(err);
		res.send(result)
	})
}

// 删除用户 参数id,account
exports.deleteUser = (req,res) => {
	const sql = 'delete from users where id = ?'
	db.query(sql, req.body.id, (err,result)=>{
		if(err) return res.cc(err);
		const sql1 = 'delete from image where account = ?'
		db.query(sql1,req.body.account,(err,result)=>{
			if(err) return res.cc(err);
			res.send({
				status:0,
				message:"删除用户成功！"
			})
		})
	})
}

// 获取对应身份的一个总人数 参数identity
exports.getAdminListLength = (req,res) => {
	const sql = 'select * from users where identity = ?'
	db.query(sql,req.body.identity,(err,result)=> {
		if(err) return res.cc(err)
		res.send({
			length:result.length
		})
	})
}

// 监听换页并返回数据 pager identity
exports.returnListData = (req,res) => {
	const number = (req.body.pager-1)*10
	// limit为要拿到的数据 offset为要跳过的数据
	const sql = `select * from users where identity = ? limit 10 offset ${number}`
	db.query(sql, req.body.identity, (err,result)=> {
		if(err) return res.cc(err)
		res.send(result)
	})
}

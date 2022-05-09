const {v4: uuid} = require('uuid');
const {encodePassword, comparePassword} = require('../utils/password');
const {getConnection, query} = require('../utils/database');
const {isEmpty} = require('../utils/validate');
const {uploadImage} = require('../utils/image');
const UserSQL = require('../sql/userSQL');
const req = require('express/lib/request');

//API  registerUser
const register = async (req, res) => {
  try {
    const {phone, password, user_name} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserQuerySQL, [phone]);
    if (!isEmpty(user)) return res.status(409).json({message: 'Số điện thoại đã được sử dụng !'});
    const newPassword = await encodePassword(password);
    const newUser = {
      user_id: uuid(),
      phone,
      password: newPassword,
      user_name,
      role: 2,
      active: 0,
      created_at: new Date(),
    };
    await query(connection, UserSQL.insertUserSQL, newUser);
    return res.status(200).json({message: 'Đăng Ký Thành Công!'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//API registerAdmin
const registerAdmin = async (req, res) => {
  try {
    let {phone, password, user_name} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserQuerySQL, [phone]);
    if (!isEmpty(user)) return res.status(409).json({message: 'Số điện thoại đã được sử dụng !'});
    const newPassword = await encodePassword(password);
    const newUser = {
      user_id: uuid(),
      phone,
      password: newPassword,
      user_name,
      role: 1,
      active: 0,
      created_at: new Date(),
    };
    await query(connection, UserSQL.insertUserSQL, newUser);
    return res.status(200).json({message: 'Đăng Ký Thành Công!'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//API loginUser
const login = async (req, res) => {
  try {
    const {phone, password} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserQuerySQL, [phone]);
    if (isEmpty(user)) {
      return res.status(404).json({message: 'Người dùng không tồn tại'});
    } else {
      const token = await comparePassword(user[0], password);
      console.log(token);
      return res.status(200).json({message: 'Đăng nhập thành công', token});
    }
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//API loginAdmin
const loginAdmin = async (req, res) => {
  try {
    const {phone, password} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserAdminQuerySQL, [phone]);
    if (isEmpty(phone) || isEmpty(password)) return res.status(500).json({message: 'Vui lòng nhập dữ liệu hợp lệ'});
    if (isEmpty(user)) {
      return res.status(404).json({message: 'Số điện thoại chưa được đăng ký'});
    } else {
      const token = await comparePassword(user[0], password);
      return res.status(200).json({message: 'Đăng nhập thành công', token});
    }
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//API recovery password
const recoveryPassword = async (req, res) => {
  try {
    const {password, phone} = req.body;

    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserQuerySQL, [phone]);
    if (isEmpty(user)) {
      return res.status(404).json({message: 'Số điện thoại chưa được đăng ký'});
    } else {
      const newPassword = await encodePassword(password);
      await query(connection, UserSQL.updatePasswordUserSQL, [newPassword, phone]);
      return res.status(200).json({message: 'Đổi mật khẩu thành công'});
    }
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//API update profile user :
const update = async (req, res) => {
  try {
    let {user_name, date_of_birth, avatar, gender, address} = req.body;
    let {user_id} = req;
    if (req?.query?.user_id) user_id = req.query.user_id;
    let newDateOfBirth = null;
    let newAvatar = null;
    if (date_of_birth) {
      const date = date_of_birth.split('-');
      newDateOfBirth = `${date[2]}-${date[1]}-${date[0]}`;
    }
    if (avatar && avatar.includes('data:image/png;base64,')) {
      newAvatar = await uploadImage(avatar);
    }
    // if (!isEmpty(password)) {
    //   password = await encodePassword(password);
    // }
    const connection = await getConnection(req);
    const user = await query(connection, `select * from user where user_id = '${user_id}'`);
    if (isEmpty(user)) return res.status(404).json({message: 'User not found'});
    await query(connection, UserSQL.updateUserSQL, [
      {
        user_name: user_name || null,
        gender: gender || user[0].gender,
        date_of_birth: newDateOfBirth || user[0].date_of_birth,
        avatar: newAvatar?.url || avatar || user[0].avatar,
        address: address || user[0].address,
        updated_at: new Date(),
      },
      user_id,
    ]);
    console.log(newAvatar?.url);
    return res.status(200).json({message: 'Sửa thành công !'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: `${error}`});
  }
};
module.exports = {register, registerAdmin, login, loginAdmin, recoveryPassword, update};

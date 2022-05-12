const {v4: uuid} = require('uuid');
const {encodePassword, comparePassword} = require('../utils/password');
const {getConnection, query} = require('../utils/database');
const {isEmpty} = require('../utils/validate');
const {uploadImage} = require('../utils/image');
const {decodeOTP, encodeOTP, generateOTP, sendOTP} = require('../utils/otp');
const UserSQL = require('../sql/userSQL');
const moment = require('moment');

const twilio = require('twilio');
const { accountSid, authToken } = require('../config');
const client = twilio(accountSid, authToken);

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
      role: 'user',
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
      role: 'admin',
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
    const userBlock = await query(connection, UserSQL.getUserBlockQuerySQL, [phone]);
    if (isEmpty(userBlock)) {
      const user = await query(connection, UserSQL.getUserQuerySQL, [phone]);
      if (isEmpty(user)) {
        return res.status(404).json({message: 'Số điện thoại chưa được đăng ký'});
      } else {
        await comparePassword(user[0], password);
        return res.status(200).json({message: 'Đăng nhập thành công', data: user[0].user_id});
      }
    } else {
      return res.status(999).json({message: 'UserBlock CMNR'});
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
    const userBlock = await query(connection, UserSQL.getUserBlockQuerySQL, [phone]);
    if (isEmpty(userBlock)) {
      const admin = await query(connection, UserSQL.getUserAdminQuerySQL, [phone]);
      const superAdmin = await query(connection, UserSQL.getUserSupperAdminQuerySQL, [phone]);
      if (isEmpty(phone) || isEmpty(password)) return res.status(500).json({message: 'Vui lòng nhập dữ liệu hợp lệ'});
      if (isEmpty(admin) && isEmpty(superAdmin)) {
        return res.status(404).json({message: 'Số điện thoại chưa được đăng ký Admin'});
      } else if (isEmpty(superAdmin)) {
        await comparePassword(admin[0], password);
        return res.status(200).json({message: 'Đăng nhập thành công', data: admin[0]});
      } else {
        await comparePassword(superAdmin[0], password);
        return res.status(200).json({message: 'Đăng nhập thành công', data: superAdmin[0]});
      }
    } else {
      return res.status(999).json({message: 'UserBlock Cút cmm đi'});
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
// api get all user
const getAllUser = async (req, res) => {
  try {
    const getUsersSQL = 'SELECT * FROM `user`';
    const connection = await getConnection(req);
    const users = await query(connection, getUsersSQL);
    for (const user of users) {
      if (user.date_of_birth) {
        user.date_of_birth = moment(user.date_of_birth).format('DD-MM-YYYY');
      }
    }
    return res.status(200).json(users);
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
// API get Detail
const detail = async (req, res) => {
  try {
    const {user_id} = req.body;
    const connection = await getConnection(req);
    const detailUserQuery = 'select *  from user where deleted_at is null and user_id=?';
    const user = await query(connection, detailUserQuery, [user_id]);
    if (isEmpty(user)) {
      return res.status(404).json({message: 'User not found'});
    }
    if (user[0].date_of_birth) {
      user[0].date_of_birth = moment(user[0].date_of_birth).format('DD-MM-YYYY');
    }
    return res.status(200).json({message: 'success', data: user[0]});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
// API delete
const remove = async (req, res) => {
  try {
    const {role} = req;
    const user_id = req.params.id;
    console.log(role);
    if (role !== 'super admin') return res.status(403).json({message: 'Không có quyền xóa'});
    const connection = await getConnection(req);
    const removeUser = `update user set deleted_at =? , active=? where user_id=?`;
    await query(connection, removeUser, [new Date(), 1, user_id]);
    return res.status(200).json({message: 'success'});
  } catch (error) {
    return res.status(500).json({message: `${e}`});
  }
};

const sendOTPAPI = async (req, res) => {
  const {phone} = req.body;
  const OTP = generateOTP();
  await sendOTP(client, OTP, phone);
  const otp_token = encodeOTP(OTP, new Date());
  return res.json({message: 'success', otp_token});
};

const verifyOTP = async (req,res) => {
  const { otp_token, otp } = req.body;
  const data = await decodeOTP(otp_token);
  if (new Date() > data.expire) return res.status(500).json({ message: 'OTP has expired' });
  if (otp != data.otp) return res.status(409).json({ message: 'OTP not match' });
  return res.status(200).json({ message: 'success' });
}

module.exports = {
  register,
  registerAdmin,
  login,
  loginAdmin,
  recoveryPassword,
  update,
  getAllUser,
  detail,
  remove,
  sendOTPAPI,
  verifyOTP
};

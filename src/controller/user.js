const {encodePassword, comparePassword} = require('../utils/password');
const {getConnection, query} = require('../utils/database');
const {isEmpty} = require('../utils/validate');
const {uploadImage} = require('../utils/image');
const {decodeOTP, encodeOTP, generateOTP, sendOTP} = require('../utils/otp');
const UserSQL = require('../sql/userSQL');
const moment = require('moment');
var jwt = require('jsonwebtoken');

const twilio = require('twilio');
const {accountSid, authToken} = require('../config');
const userSQL = require('../sql/userSQL');
const {render} = require('express/lib/response');
const client = twilio(accountSid, authToken);

//API checkUser
const checkUser = async (req, res) => {
  try {
    const {phone} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserQuerySQL, [phone]);
    if (!isEmpty(user)) return res.status(409).json({message: 'Số điện thoại đã được sử dụng !'});
    return res.status(200).json({message: 'SĐT hợp lệ'});
  } catch (error) {
    return res.status(500).json({message: `${error}`});
  }
};
//API  registerUser
const register = async (req, res) => {
  try {
    const {user_id,phone, password, user_name} = req.body;
    const connection = await getConnection(req);
    const newPassword = await encodePassword(password);
    const newUser = {
      user_id: user_id,
      phone,
      password: newPassword,
      user_name,
      gender: 1,
      date_of_birth: new Date(),
      permission	: 'user',
      active: 0,
      created_at: new Date(),
    };
    await query(connection, UserSQL.insertUserSQL, newUser);
    return res.status(200).json({message: 'Đăng Ký Thành Công!'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const getInsertUser = async (req, res) => {
  res.render('insertAdmin');
};
const postInsertUser = async (req, res) => {
  try {
    const data = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserQuerySQL, [data.phone]);
    const lengthListUser = (await query(connection, userSQL.getLengthListUser)).length;
    console.log(lengthListUser);
    const id = 'User' + (lengthListProduct + 1);
    if (!isEmpty(user)) return res.status(409).json({message: 'Số điện thoại đã được sử dụng !'});
    if (req.files.avatar.data) {
      var avatar = 'data:image/jpeg;base64,' + req.files.avatar.data.toString('base64');
      const upload = await uploadImage(avatar);
      avatar = upload.url;
    }
    const newPassword = await encodePassword(data.password);
    const newUser = {
      user_id: id,
      phone: data.phone,
      password: newPassword,
      user_name: data.user_name,
      gender: data.gender,
      address: data.address,
      permission	: data.permission	,
      avatar: avatar,
      active: 0,
      created_at: new Date(),
    };
    await query(connection, UserSQL.insertUserSQL, newUser);
    const listUser = await query(connection, userSQL.queryAllUser);
    res.render('user', {listUser: listUser});
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
      return res.status(999).json({message: 'UserBlock'});
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
    let {user_id} = req?.query;
    if (req?.query?.user_id) user_id = req.query.user_id;
    let newDateOfBirth = null;
    let newAvatar = null;
    if (date_of_birth) {
      const date = date_of_birth.split('-');
      newDateOfBirth = `${date[2]}-${date[1]}-${date[0]}`;
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
    return res.status(200).json({message: 'Sửa thành công !'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: `${error}`});
  }
};

// API get Detail
const detail = async (req, res) => {
  try {
    const user_id = req.params.id;
    const connection = await getConnection(req);
    const detailUserQuery = 'select *  from user where deleted_at is null and user_id=?';
    const user = await query(connection, detailUserQuery, [user_id]);
    if (isEmpty(user)) {
      return res.status(404).json({message: 'User not found'});
    }
    if (user.date_of_birth) {
      user.date_of_birth = moment(user.date_of_birth).format('DD-MM-YYYY');
    }
    return res.status(200).json({data: user[0]});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
const userDetail = async (req, res) => {
  const user_id = req.params.id;
  const connection = await getConnection(req);
  const detailUserQuery = 'select *  from user where  user_id=?';
  const user = await query(connection, detailUserQuery, [user_id]);
  if (user[0].date_of_birth) {
    user.date_of_birth = moment(user.date_of_birth).format('DD-MM-YYYY');
  }
  if (user[0].created_at) {
    user.created_at = moment(user.created_at).format('DD-MM-YYYY');
  }
  res.render('detail_user', {user: user[0]});
};

const searchUser = async (req, res) => {
  const data = req.body;
  const connection = await getConnection(req);
  const searchUser = 'select *  from user where  user_name=?';
  const user = await query(connection, searchUser, [data.user_name]);
  res.render('user', {listUser: user});
};
// API delete
const blockUser = async (req, res) => {
  try {
    // const {permission	} = req;
    const user_id = req.params.id;
    // if (permission	 !== 'super admin') return res.status(403).json({message: 'Không có quyền xóa'});
    const connection = await getConnection(req);
    const removeUser = `update user set deleted_at =? , active=? where user_id=?`;
    await query(connection, removeUser, [new Date(), 1, user_id]);
    const listUser = await query(connection, userSQL.queryListUser);
    for (const user of listUser) {
      if (user.date_of_birth) {
        user.date_of_birth = moment(user.date_of_birth).format('DD-MM-YYYY');
      }
    }
    res.render('user', {listUser: listUser});
  } catch (error) {
    return res.status(500).json({message: `${e}`});
  }
};
const activeUser = async (req, res) => {
  try {
    // const {permission	} = req;
    const user_id = req.params.id;
    // if (permission	 !== 'super admin') return res.status(403).json({message: 'Không có quyền xóa'});
    const connection = await getConnection(req);
    const activeUser = `update user set deleted_at =null, active=0 where user_id=?`;
    await query(connection, activeUser, [user_id]);
    const listUser = await query(connection, userSQL.queryListUser);
    for (const user of listUser) {
      if (user.date_of_birth) {
        user.date_of_birth = moment(user.date_of_birth).format('DD-MM-YYYY');
      }
    }
    res.render('user', {listUser: listUser});
  } catch (error) {
    return res.status(500).json({message: `${e}`});
  }
};

const apiSendOTP = async (req, res) => {
  const {phone} = req.body;
  const OTP = generateOTP();
  await sendOTP(client, OTP, phone);
  const otp_token = encodeOTP(OTP, new Date());
  return res.json({message: 'success', otp_token});
};

const verifyOTP = async (req, res) => {
  const {otp_token, otp} = req.body;
  const data = await decodeOTP(otp_token);
  if (new Date() > data.expire) return res.status(500).json({message: 'OTP has expired'});
  if (otp != data.otp) return res.status(409).json({message: 'OTP not match'});
  return res.status(200).json({message: 'success'});
};
const getAddress = async (req, res) => {
  try {
    const user_id = req.params.id;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserById, [user_id]);
    const address = await query(connection, userSQL.getAddressUserById, [user_id]);
    if (isEmpty(user)) return res.status(404).json({message: 'User not found'});
    if (isEmpty(address[0]?.address)) return res.status(406).json({message: 'Address not found'});
    return res.status(200).json(address[0]);
  } catch (error) {
    return res.json({message: `${error}`});
  }
};

const updateAddress = async (req, res) => {
  try {
    const {user_id, address} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserById, [user_id]);
    if (isEmpty(user)) return res.status(404).json({message: 'User not found'});

    await query(connection, UserSQL.updateAddressUser, [address, user_id]);
    return res.status(200).json({message: 'success'});
  } catch (error) {
    return res.json({message: `${error}`});
  }
};

const getUser = async (req, res) => {
  try {
    const connection = await getConnection(req);
    const listUser = await query(connection, UserSQL.queryAllUser);
    return res.status(200).json({message: 'success', listUser: listUser});
  } catch (error) {
    return res.json({message: `${error}`});
  }
};
//WEB VIEW
//User
// getView

const loginWeb = async (req, res) => {
  res.render('login');
};
// postData
//WEB loginAdmin

const loginAdmin = async (req, res) => {
  try {
    const data = req.body;
    const connection = await getConnection(req);
    const queryDoanhThu = `SELECT MONTH(created_at) as month ,SUM(total_price) as DoanhThu FROM bill WHERE status="Đã Giao" AND YEAR(created_at) = 2022 GROUP BY MONTH(created_at) ORDER BY MONTH(created_at) ASC`;
    const ListDoanhThu = await query(connection, queryDoanhThu);
    for (const doanhthu of ListDoanhThu) {
      doanhthu.DoanhThu = formatMoney(doanhthu.DoanhThu);
    }
    queryTop10User = `SELECT user.user_name,bill.user_id , COUNT(bill.bill_id) as SoLuongDon 
    FROM bill ,user 
    WHERE user.user_id = bill.user_id AND status="Đã Giao"
    GROUP BY user_id 
    ORDER BY COUNT(bill_id) DESC LIMIT 0,10`;
    const listTop10User = await query(connection, queryTop10User);
    queryCountBillDone = `SELECT COUNT(bill_id) as bill_done FROM bill WHERE status="Đã Giao"`;
    queryCountBillCanceled = `SELECT COUNT(bill_id) as countBillCanceled FROM bill WHERE status="Đã Hủy"`;
    queryCountBillReturnRequest = `SELECT COUNT(bill_id) as countBillReturnRequest FROM bill WHERE status="Đã Hoàn"`;
    queryCountBillWaiting = `SELECT COUNT(bill_id) as countBillWaiting FROM bill WHERE status="Đang Chờ" OR status="Đang Xử Lý" OR status="Đang Giao"`;
    queryCountBillFail = `SELECT COUNT(bill_id) as countBillFail FROM bill WHERE status="Giao Thất Bại"`;
    const countBillDone = await query(connection, queryCountBillDone);
    const countBillCanceled = await query(connection, queryCountBillCanceled);
    const countBillReturnRequest = await query(connection, queryCountBillReturnRequest);
    const countBillWaiting = await query(connection, queryCountBillWaiting);
    const countBillFail = await query(connection, queryCountBillFail);

    const userBlock = await query(connection, userSQL.getUserBlockQuerySQL, [data.phone.trim()]);
    if (isEmpty(userBlock)) {
      const admin = await query(connection, userSQL.getUserAdminQuerySQL, [data.phone.trim()]);
      const superAdmin = await query(connection, userSQL.getUserSupperAdminQuerySQL, [data.phone]);
      if (isEmpty(data.phone.trim()) || isEmpty(data.password.trim()))
        return res.status(500).json('Vui lòng nhập dữ liệu hợp lệ');
      if (isEmpty(admin) && isEmpty(superAdmin)) {
        return res.status(404).json('Số điện thoại chưa được đăng ký Admin');
      } else if (isEmpty(superAdmin)) {
        await comparePassword(admin[0], data.password);
        const token = jwt.sign({user_id: admin[0].user_id}, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('token', token);
        res.render('main', {
          ListDoanhThu: ListDoanhThu,
          listTop10User: listTop10User,
          countBillDone: countBillDone[0].bill_done,
          countBillCanceled: countBillCanceled[0].countBillCanceled,
          countBillReturnRequest: countBillReturnRequest[0].countBillReturnRequest,
          countBillWaiting: countBillWaiting[0].countBillWaiting,
          countBillFail: countBillFail[0].countBillFail,
        });
      } else {
        await comparePassword(superAdmin[0], data.password);
        const token = jwt.sign({user_id: superAdmin[0].user_id}, process.env.ACCESS_TOKEN_SECRET);
        res.cookie('token', token);
        res.render('main', {
          ListDoanhThu: ListDoanhThu,
          listTop10User: listTop10User,
          countBillDone: countBillDone[0].bill_done,
          countBillCanceled: countBillCanceled[0].countBillCanceled,
          countBillReturnRequest: countBillReturnRequest[0].countBillReturnRequest,
          countBillWaiting: countBillWaiting[0].countBillWaiting,
          countBillFail: countBillFail[0].countBillFail,
        });
      }
    } else {
      return res.status(999).json({message: 'UserBlock Cút cmm đi'});
    }
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const getAllUser = async (req, res) => {
  const connection = await getConnection(req);
  const listUser = await query(connection, userSQL.queryListUser);
  res.render('user', {listUser: listUser});
};

const getAll = async (req, res) => {
  const connection = await getConnection(req);
  const listUser = await query(connection, userSQL.queryAllUser);
  res.render('user', {listUser: listUser});
};
const getAllAdmin = async (req, res) => {
  const connection = await getConnection(req);
  const listAdmin = await query(connection, userSQL.queryListAdmin);
  res.render('user', {listUser: listAdmin});
};
const getAllUserTest = async (req, res) => {
  try {
    // const {user_id} = req.body;
    const connection = await getConnection(req);
    const listUser = await query(connection, userSQL.queryAllUser);
    console.log(listUser);
    return res.status(200).json({listUser: listUser});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const getSupperAdmin = async (req, res) => {
  const connection = await getConnection(req);
  const supperAdmin = await query(connection, userSQL.getSupperAdmin);
  res.render('user', {listUser: supperAdmin});
};

const getUserBlock = async (req, res) => {
  const connection = await getConnection(req);
  const listUser = await query(connection, userSQL.getAllUserBlock);
  res.render('user', {listUser: listUser});
};

module.exports = {
  getUser,
  getAllUserTest,
  getInsertUser,
  postInsertUser,
  searchUser,
  userDetail,
  getAddress,
  updateAddress,
  register,
  login,
  recoveryPassword,
  update,
  detail,
  blockUser,
  apiSendOTP,
  verifyOTP,
  checkUser,
  activeUser,
  loginWeb,
  getUserBlock,
  getSupperAdmin,
  getAllAdmin,
  getAll,
  getAllUser,
  loginAdmin,
};

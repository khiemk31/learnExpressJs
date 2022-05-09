const {v4: uuid} = require('uuid');
const {encodePassword, comparePassword} = require('../utils/password');
const {getConnection, query} = require('../utils/database');
const {isEmpty} = require('../utils/validate');
const UserSQL = require('../sql/userSQL');
const req = require('express/lib/request');

//API  registerUser
const register = async (req, res) => {
  try {
    const {phone, password} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserQuerySQL, [phone]);
    if (!isEmpty(user)) return res.status(409).json({message: 'Phone or email existed'});
    const newPassword = await encodePassword(password);
    const newUser = {user_id: uuid(), phone, password: newPassword, role: 2,  active: 0, created_at: new Date()};
    await query(connection, UserSQL.insertUserSQL, newUser);
    return res.status(200).json({message: 'success'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//API registerAdmin
const registerAdmin = async (req, res) => {
  try {
    let {phone, password} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getUserQuerySQL, [phone]);
    if (!isEmpty(user)) return res.status(409).json({message: 'Phone or email existed'});
    const newPassword = await encodePassword(password);
    const newUser = {user_id: uuid(), phone, password: newPassword, role: 1,  active: 0, created_at: new Date()};
    await query(connection, UserSQL.insertUserSQL, newUser);
    return res.status(200).json({message: 'success'});
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
      return res.status(404).json({message: 'User not found'});
    } else {
      const token = await comparePassword(user[0], password);
      return res.status(200).json({message: 'success', token});
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
    if (isEmpty(phone) || isEmpty(password)) return res.status(500).json({message: 'Please enter valid data'});
    if (isEmpty(user)) {
      return res.status(404).json({message: 'User not found'});
    } else {
      const token = await comparePassword(user[0], password);
      return res.status(200).json({message: 'success', token});
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
      return res.status(404).json({ message: 'User not found' });
    } else {
      const newPassword = await encodePassword(password);
      await query(connection, UserSQL.updateUserSQL, [newPassword, phone]);
      return res.status(200).json({ message: 'success' });
    }
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
module.exports = {register, registerAdmin, login, loginAdmin ,recoveryPassword};

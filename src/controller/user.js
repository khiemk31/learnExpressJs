const {v4: uuid} = require('uuid');
const {encodePassword ,comparePassword} = require('../utils/password');
const {getConnection, query} = require('../utils/database');
const {isEmpty} = require('../utils/validate');
const UserSQL = require('../sql/userSQL');

const register = async (req, res) => {
  try {
    const {phone, password, gender} = req.body;
    const connection = await getConnection(req);
    const user = await query(connection, UserSQL.getConflictPhoneSQL, [phone]);
    if (!isEmpty(user)) return res.status(409).json({message: 'Phone or email existed'});
    const newPassword = await encodePassword(password);
    const newUser = {user_id: uuid(), phone, password: newPassword, role: 2, gender, active:0, created_at: new Date()};
    await query(connection, UserSQL.insertUserSQL, newUser);
    return res.status(200).json({message: 'success'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const phoneLogin = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const loginPhoneUserQuery = 'select * from user where deleted_at is null and phone=?';
    const connection = await getConnection(req);
    const user = await query(connection, loginPhoneUserQuery, [phone]);
    if (isEmpty(user)) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      const token = await comparePassword(user[0], password);
      return res.status(200).json({ message: 'success', token });
    }
  } catch (e) {
    return res.status(500).json({ message: `${e}` });
  }
};

module.exports = {register ,phoneLogin};


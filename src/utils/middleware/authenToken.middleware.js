var jwt = require('jsonwebtoken');
const {getConnection, query} = require('../database');

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    console.log('chưa login ');
    res.render('login');
    return;
  } else {
    const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    const queryUser = `SELECT role FROM user where user_id =?`;
    const connection = await getConnection(req);
    const role = await query(connection, queryUser, [user_id]);
    if (role[0].role == 'super admin' || role[0].role == 'admin') {
      next();
    } else {
      res.render('login', {
        errors: ['Bạn không có quyền truy cập'],
      });
      return;
    }
  }
};

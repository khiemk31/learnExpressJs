var jwt = require('jsonwebtoken');
const {getConnection, query} = require('../utils/database');
const moment = require('moment');
const {uploadImage} = require('../utils/image');
const userSQL = require('../sql/userSQL');
const {isEmpty} = require('../utils/validate');

const profile = async (req, res) => {
  const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
  const connection = await getConnection(req);
  detailUserQuery = 'SELECT * FROM user WHERE user_id=?';
  queryDonDaDat = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đang Giao" OR status="Hoàn Thành" OR status="Chờ Xác Nhận") AND user_id=?`;
  queryDonDaHuy = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đã Hủy" OR status="Đã Hoàn") AND user_id=?`;
  queryDoanhThu = `SELECT SUM(total_price) AS doanhThu FROM bill WHERE status="Hoàn Thành" AND user_id=?`;
  const donDaDat = await query(connection, queryDonDaDat, [user_id]);
  const donDaHuy = await query(connection, queryDonDaHuy, [user_id]);
  const doanhThu = await query(connection, queryDoanhThu, [user_id]);
  const user = await query(connection, detailUserQuery, [user_id]);
  if (user[0].date_of_birth) {
    user[0].date_of_birth = moment(user[0].date_of_birth).format('DD/MM/YYYY');
  }
  if (user[0].created_at) {
    user[0].created_at = moment(user[0].created_at).format('DD/MM/YYYY');
  }
  if (doanhThu[0].doanhThu) {
    doanhThu[0].doanhThu = formatMoney(doanhThu[0].doanhThu);
  }
  res.render('profile', {user: user[0], donDaDat: donDaDat[0].soDon, donDaHuy: donDaHuy[0].soDon, doanhThu: doanhThu[0].doanhThu});
};

const edit = async (req, res) => {
  const edit = req.query.edit;
  const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
  const connection = await getConnection(req);
  detailUserQuery = 'SELECT * FROM user WHERE user_id=?';
  queryDonDaDat = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đang Giao" OR status="Hoàn Thành" OR status="Chờ Xác Nhận") AND user_id=?`;
  queryDonDaHuy = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đã Hủy" OR status="Đã Hoàn") AND user_id=?`;
  queryDoanhThu = `SELECT SUM(total_price) AS doanhThu FROM bill WHERE status="Hoàn Thành" AND user_id=?`;
  const donDaDat = await query(connection, queryDonDaDat, [user_id]);
  const donDaHuy = await query(connection, queryDonDaHuy, [user_id]);
  const doanhThu = await query(connection, queryDoanhThu, [user_id]);
  const user = await query(connection, detailUserQuery, [user_id]);
  if (user[0].date_of_birth) {
    user[0].date_of_birth = moment(user[0].date_of_birth).format('DD/MM/YYYY');
  }
  if (user[0].created_at) {
    user[0].created_at = moment(user[0].created_at).format('DD/MM/YYYY');
  }
  if (doanhThu[0].doanhThu) {
    doanhThu[0].doanhThu = formatMoney(doanhThu[0].doanhThu);
  }
  res.render('profile', {user: user[0], donDaDat: donDaDat[0].soDon, donDaHuy: donDaHuy[0].soDon, doanhThu: doanhThu[0].doanhThu, edit: true});
};

const update = async (req, res) => {
  try {
    const user_id = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET).user_id;
    let data = req.body;
    let newAvatar = null;
    // if (data.date_of_birth) {
    //   const date = data.date_of_birth.split('-');
    //   newDateOfBirth = `${date[2]}-${date[1]}-${date[0]}`;
    // }

    if (req.files?.avatar.data) {
      var avatar = 'data:image/jpeg;base64,' + req.files.avatar.data.toString('base64');
      const upload = await uploadImage(avatar);
      newAvatar = upload.url;
    }

    const connection = await getConnection(req);
    detailUserQuery = 'SELECT * FROM user WHERE user_id=?';
    var user = await query(connection, detailUserQuery, [user_id]);
    if (isEmpty(user)) return res.status(404).json({message: 'Không tìm thấy User'});
    await query(connection, userSQL.updateUserSQL, [
      data.user_name || user[0].user_name || null,
      data.gender || user[0].gender,
      data.date_of_birth || user[0].date_of_birth,
      newAvatar || user[0].avatar,
      data.address || user[0].address,
      new Date(),
      user_id,
    ]);
    user = await query(connection, detailUserQuery, [user_id]);
    queryDonDaDat = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đang Giao" OR status="Hoàn Thành" OR status="Chờ Xác Nhận") AND user_id=?`;
    queryDonDaHuy = `SELECT COUNT(bill_id) AS soDon FROM bill WHERE (status="Đã Hủy" OR status="Đã Hoàn") AND user_id=?`;
    queryDoanhThu = `SELECT SUM(total_price) AS doanhThu FROM bill WHERE status="Hoàn Thành" AND user_id=?`;
    const donDaDat = await query(connection, queryDonDaDat, [user_id]);
    const donDaHuy = await query(connection, queryDonDaHuy, [user_id]);
    const doanhThu = await query(connection, queryDoanhThu, [user_id]);

    if (user[0].date_of_birth) {
      user[0].date_of_birth = moment(user[0].date_of_birth).format('DD/MM/YYYY');
    }
    if (user[0].created_at) {
      user[0].created_at = moment(user[0].created_at).format('DD/MM/YYYY');
    }
    if (doanhThu[0].doanhThu) {
      doanhThu[0].doanhThu = formatMoney(doanhThu[0].doanhThu);
    }
    res.render('profile', {user: user[0], donDaDat: donDaDat[0].soDon, donDaHuy: donDaHuy[0].soDon, doanhThu: doanhThu[0].doanhThu});
  } catch (error) {
    console.log(error);
    return res.status(500).json({message: `${error}`});
  }
};

module.exports = {
  profile,
  edit,
  update,
};

const { render } = require('express/lib/response');
const {getConnection, query} = require('../utils/database');
const {formatMoney} = require('../utils/formatMoney');
const main = async (req, res) => {
  const connection = await getConnection(req);
  queryDoanhThu = `SELECT MONTH(created_at) as month ,SUM(total_price) as DoanhThu FROM bill WHERE status="Đã Giao" AND YEAR(created_at) = 2022 GROUP BY MONTH(created_at) ORDER BY MONTH(created_at) ASC`;
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

  res.render('main', {
    ListDoanhThu: ListDoanhThu,
    listTop10User: listTop10User,
    countBillDone: countBillDone[0].bill_done,
    countBillCanceled: countBillCanceled[0].countBillCanceled,
    countBillReturnRequest: countBillReturnRequest[0].countBillReturnRequest,
    countBillWaiting: countBillWaiting[0].countBillWaiting,
    countBillFail: countBillFail[0].countBillFail,
  });
};

module.exports = {
  main,
};

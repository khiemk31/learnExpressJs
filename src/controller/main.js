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
  res.render('main', {ListDoanhThu: ListDoanhThu, listTop10User: listTop10User});
};

module.exports = {
  main,
};

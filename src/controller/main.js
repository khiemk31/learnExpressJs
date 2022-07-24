const {getConnection, query} = require('../utils/database');
const {formatMoney} = require('../utils/formatMoney');

const main = async (req, res) => {
  const connection = await getConnection(req);
  queryDoanhThu = `SELECT MONTH(created_at) as month ,SUM(total_price) as DoanhThu FROM bill WHERE status="Hoàn Thành" AND YEAR(created_at) = 2022 GROUP BY MONTH(created_at) ORDER BY MONTH(created_at) ASC`;
  queryTongDoanhThu = `SELECT SUM(total_price) as TongDoanhThu FROM bill WHERE status="Hoàn Thành" `;
  queryDonHoanThanh = `SELECT COUNT(bill_id) as DonDaGiao FROM bill WHERE status="Hoàn Thành" `;
  queryDonDangXuLy = `SELECT COUNT(bill_id) as DonDangXuLy FROM bill WHERE status="Chờ Xác Nhận" OR status="Yêu Cầu Hủy Đơn" OR status="Yêu Cầu Trả Đơn" OR status="Đang Giao"`;
  queryDonThatBai = `SELECT COUNT(bill_id) as DonThatBai FROM bill WHERE status="Đã Hủy" OR status="Đã Hoàn" OR status="Thất Bại" OR status="Từ Chối"`;
  const ListDoanhThu = await query(connection, queryDoanhThu);
  const tongDoanhThu = await query(connection, queryTongDoanhThu);
  tongDoanhThu[0].TongDoanhThu = formatMoney(tongDoanhThu[0].TongDoanhThu);
  const donDaGiao = await query(connection, queryDonHoanThanh);
  const donDangXuLy = await query(connection, queryDonDangXuLy);
  const donThatBai = await query(connection, queryDonThatBai);

  queryTop10User = `SELECT user.user_name,bill.user_id , COUNT(bill.bill_id) as SoLuongDon 
  FROM bill ,user 
  WHERE user.user_id = bill.user_id AND status="Đã Giao"
  GROUP BY user_id 
  ORDER BY COUNT(bill_id) DESC LIMIT 0,10`;
  res.render('main', {
    ListDoanhThu: ListDoanhThu,
    tongDoanhThu: tongDoanhThu[0].TongDoanhThu,
    donDaGiao: donDaGiao[0].DonDaGiao,
    donDangXuLy: donDangXuLy[0].DonDangXuLy,
    donThatBai: donThatBai[0].DonThatBai,
  });
};

module.exports = {
  main,
};

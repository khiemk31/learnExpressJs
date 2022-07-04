module.exports = {
  insertBill: `insert into bill set ?`,
  insertBillDetails: `insert into bill_detail set ?`,
  queryListBillByUserID: `SELECT bill.bill_id ,bill.status , bill.total_price ,bill.total_price ,bill.total_product  , bill.product_name ,bill.size ,bill.quantity, bill.price ,bill.product_image ,bill.created_at FROM bill WHERE user_id=?`,
  queryBillByBillID: `SELECT bill.bill_id,bill.status, user.phone, user.user_name, bill.address , bill.created_at ,bill.total_price ,bill.cancellation_reason , bill.feedback , bill.return_request FROM bill , user WHERE bill.user_id = user.user_id AND bill_id=?`,
  queryBillDetailByBillID: `SELECT bill_detail.product_name, bill_detail.size, bill_detail.quantity, product.price , product.product_image FROM bill_detail , product WHERE bill_detail.product_name = product.product_name AND bill_id= ?`,
  queryBill: `SELECT * FROM bill where bill_id=?`,
  queryListID: `SELECT bill_id FROM bill `,
  updateStatusBill: `UPDATE bill SET status = "Yêu Cầu Hủy" WHERE bill_id=?`,
  updateBill: 'UPDATE bill SET status = ? , cancellation_reason= ? WHERE bill_id= ? ',
  updateFeedBack: 'UPDATE bill SET  feedback = ? WHERE bill_id = ? ',
  updateReturnRequest: 'UPDATE bill SET  status = ? , return_request = ? WHERE bill_id = ? ',
  queryAllBill:
    'SELECT  bill.bill_id, user.phone, user.user_name,bill.address,bill.total_price,bill.total_product,bill.status,bill.created_at  FROM bill,user WHERE bill.user_id=user.user_id  ORDER BY bill.status ASC',
  queryBillById: `SELECT *FROM bill where bill_id=?`,
  updateStatusBillWeb: `UPDATE bill SET status= ? WHERE bill_id= ?`,
};

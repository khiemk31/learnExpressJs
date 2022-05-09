module.exports = {
  getUserQuerySQL: 'select * from user where deleted_at is null and phone=?',
  insertUserSQL: 'insert into user set ?',
  getUserAdminQuerySQL: 'select * from user where deleted_at is null and phone=? and role=1 ',
  updateUserSQL: 'update user set password=? where phone=?',
};

module.exports = {
  getUserQuerySQL: 'select * from user where deleted_at is null and phone=?',
  insertUserSQL: 'insert into user set ?',
  getUserAdminQuerySQL: "select * from user where deleted_at is null and phone=? and role='admin'",
  getUserSupperAdminQuerySQL: "select * from user where phone=? and role='super admin'",
  updatePasswordUserSQL: 'update user set password=? where phone=?',
  updateUserSQL:'update user set ? where user_id=?',
  getUserIDWithPhoneQuerySQL:'select *from user_id where deleted_at is null and phone=?',
};

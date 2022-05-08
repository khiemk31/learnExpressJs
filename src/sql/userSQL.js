module.exports = {
  getConflictPhoneSQL: 'select * from user where deleted_at is null and phone=?',
};

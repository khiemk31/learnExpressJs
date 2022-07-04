module.exports = {
     insertSizeSQL : `insert into size set ?`,
     getSizeQuery : `SELECT * FROM size WHERE size= ?`,
     selectSizeByIdQuery : `SELECT * FROM size WHERE size.deleted_at IS NULL AND size.size_id = ?`,
     updateSizeQuery : `UPDATE size SET ? WHERE size.size_id= ?`,
     removeSizeQuery : `UPDATE size SET size.deleted_at= ? WHERE size.size_id= ?`,
  };
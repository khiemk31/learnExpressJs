module.exports = {
     insertSizeQuery : 'insert into size set ?',
     selectColorByColorIDQuery :
      'SELECT color.color FROM color WHERE color.deleted_at IS NULL AND color.color_id = ?',
     selectConflictSize : 'SELECT * FROM size WHERE size.color_id= ? AND size.size= ?',
     selectSizeByIdQuery : 'SELECT * FROM size WHERE size.deleted_at IS NULL AND size.size_id = ?',
     updateSizeQuery : 'UPDATE size SET ? WHERE size.size_id= ?',
     removeSizeQuery : 'UPDATE size SET size.deleted_at= ? WHERE size.size_id= ?',
  };
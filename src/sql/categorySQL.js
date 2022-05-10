module.exports = {
  categoryQueryByNameSQL: 'select * from category where deleted_at is null and category_name=?',
  categoryQueryByIdSQL: 'select * from category where  deleted_at is null and category_id=?',
  insertCategorySQL: 'insert into category set ?',
  updateCategorySQL: 'update category set ? where category_id=?',
  listCategoryQuerySQL: 'select * from category where deleted_at is null order by category_name desc',
  deleteCategorySQL: 'update category set deleted_at=? where category_id=?',
};

module.exports = {
  queryListCategory: `SELECT * FROM category WHERE deleted_at IS null`,
  categoryQueryByNameSQL: `select * from category where deleted_at is null and category_name=?`,
  categoryQueryByIdSQL: `select * from category where  deleted_at is null and category_id=?`,
  insertCategorySQL: `insert into category set ?`,
  updateCategorySQL: `update category set ? where category_id=?`,
  listCategoryQuerySQL: `SELECT category_id , category_name ,category_image FROM category WHERE deleted_at is null`,
  listCategoryDeleted: `SELECT * FROM category WHERE deleted_at is not null`,
  listCategoryUpdated: `SELECT * FROM category WHERE updated_at is not null`,
  listCategoryCreated: `SELECT * FROM category WHERE deleted_at is null ORDER BY created_at DESC`,
  listCategoryUpdate: `SELECT category_name , created_at , updated_at FROM category ORDER BY category_name ASC`,
  deleteCategorySQL: `update category set deleted_at=? where category_id=?`,
  listNameCategoryQuerySQL: `select category_name from category where deleted_at is null order by category_name ASC`,
};

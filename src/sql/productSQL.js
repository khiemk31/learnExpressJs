const categoryQuery = `select * from category where category_id =? and deleted_at is null`;
const productQuery = `select * from product where deleted_at is null and product_name =? `;
const insertProductQuery = `insert into product set ?`;
const productIDQuery = `select * from product where deleted_at is null and product_id=?`;
const updateQuery = `UPDATE product SET deleted_at= ? WHERE product_id= ?`;
const getLengthListProduct = `SELECT * FROM product`;
const getAllProduct = `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL`;
const getNewProduct = `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL  ORDER BY product.created_at DESC`;
const getProductDeleted = `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is not NULL OR category.deleted_at is not NULL`;
const insertListImage = `INSERT INTO product_detail_image set ?`;
const detailProductQuery = `select  product_id, product_name ,price ,product_image ,product_bgr1 ,product_bgr2 ,product_bgr3  from product where deleted_at is null and product_id=?`;
const listSizeProductQuery = `select size , quantity from size where  product_id=?`;
const queryProductByCategory = `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL and category.category_id=?`;
const querySearchProductByName = `SELECT product.product_id ,product.product_name, product.product_image , product.price  from  product , category WHERE  product.category_id = category.category_id and  product.deleted_at is NULL and category.deleted_at is NULL and product.product_name=?`;
module.exports = {
  getLengthListProduct,
  categoryQuery,
  productQuery,
  insertProductQuery,
  productIDQuery,
  updateQuery,
  getAllProduct,
  insertListImage,
  detailProductQuery,
  listSizeProductQuery,
  queryProductByCategory,
  querySearchProductByName,
  getNewProduct,
  getProductDeleted,
};

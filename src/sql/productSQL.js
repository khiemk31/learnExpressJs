const categoryQuery = 'select * from category where category_id =? and deleted_at is null';
const productQuery = 'select * from product where deleted_at is null and product_name =? ';
const insertProductQuery = 'insert into product set ?';
const insertColorQuery = 'insert into color set ?';
const insertSizeQuery = 'insert into size set ?';

const productIDQuery = 'select * from product where deleted_at is null and product_id=?';
const updateQuery = 'UPDATE product SET deleted_at= ? WHERE product_id= ?';
const removeSize = 'UPDATE size SET deleted_at= ? WHERE size_id= ?';

// const productDetailQuery =
//   'SELECT * FROM product, color, size WHERE product.deleted_at is null and color.deleted_at is null AND size.deleted_at is null AND product.product_id =? AND product.product_id = color.product_id AND color.color_id = size.color_id';
const productDetailQuery =
  'select product.*, color.color_id, color.color, size.size_id, size.size, size.import_quantity,size.color_id,size.sold_quantity from product inner join color on color.product_id = product.product_id inner join size on size.color_id = color.color_id where product.deleted_at is null and color.deleted_at is null and size.deleted_at is null and product.product_id =?';
const productsAllQuery =
  'SELECT product.*, category.category_name, color.color, color.color_id, size.size_id, size.size, size,import_quantity, size.sold_quantity FROM product inner join category on product.category_id = category.category_id inner join color on product.product_id = color.product_id inner join size on size.color_id = color.color_id where product.deleted_at is null and color.deleted_at is null and size.deleted_at is null';
const dealsFavorite = 'select * from favorite where deleted_at is null and user_id =?';

const hotDealsQuery = (limit, offset) => `select * from product where deleted_at is null order by sale_off desc limit ${limit} offset ${offset}`;

const listCategoryQuery = (limit, offset) =>
  `select product.product_id, product.product_name,product.description,product.price,product.view, product.sale_off,product.image,category.category_id,category.category_name from product INNER JOIN category ON product.category_id = category.category_id where product.category_id = ? and product.deleted_at is null limit ${limit} offset ${offset}`;

const listAllCategoryQuery = () =>
  `select product.product_id from product INNER JOIN category ON product.category_id = category.category_id where product.category_id = ? and product.deleted_at is null`;

const listSuggestions = (limit, offset) =>
  `select product.product_id, product.product_name, product.image, product.view ,sum(size.sold_quantity) as total from product inner join color on product.product_id = color.product_id inner join size on color.color_id = size.color_id where product.deleted_at is null and color.deleted_at is null and size.deleted_at is null group by product.product_id order by total desc limit ${limit} offset ${offset}`;

const updateProductQuery = `UPDATE product SET ? WHERE product_id =?`;
const checkDelete = 'SELECT * FROM product WHERE deleted_at is null AND product_id= ?';

const getAllProductsBySearchSQL = (search) => `select * from product where deleted_at is null and product_name like '${search}%'`;
const getProductsBySearchSQL = (search, limit, offset) =>
  `select * from product where deleted_at is null and product_name like '${search}%' order by product_id asc limit ${limit} offset ${offset}`;

const getProductByProductIdSQL = 'select * from product where deleted_at is null and product_id=?';

const addViewQuery = 'UPDATE product SET view = ? WHERE product.product_id = ?';

export {
  categoryQuery,
  productQuery,
  insertProductQuery,
  insertColorQuery,
  insertSizeQuery,
  productIDQuery,
  updateQuery,
  productDetailQuery,
  productsAllQuery,
  dealsFavorite,
  listCategoryQuery,
  hotDealsQuery,
  listSuggestions,
  listAllCategoryQuery,
  updateProductQuery,
  checkDelete,
  getProductsBySearchSQL,
  getAllProductsBySearchSQL,
  getProductByProductIdSQL,
  addViewQuery,
  removeSize,
};

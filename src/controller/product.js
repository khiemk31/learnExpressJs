const {isEmpty} = require('../utils/validate');
const productSQL = require('../sql/productSQL');
const sizeSQL = require('../sql/sizeSQL');
const categorySQL = require('../sql/categorySQL');
const {getConnection, query} = require('../utils/database');
const {uploadImage} = require('../utils/image');
const moment = require('moment');
const {getTotalPage} = require('../utils/index');
const {formatMoney} = require('../utils/formatMoney');

//Product Web View
//getALL
const product = async (req, res) => {
  const connection = await getConnection(req);
  const listProduct = await query(connection, productSQL.getAllProduct);
  for (const product of listProduct) {
    product.price = formatMoney(product.price);
  }
  res.render('product1', {listProduct: listProduct});
};
//delete
const removeProduct = async (req, res) => {
  try {
    const {id} = req.params;
    // if (permission !== 'admin' && permission !== 'supper admin')
    //   return res.status(403).json({message: 'You don’t have permission to access'});
    const connection = await getConnection(req);
    const product = await query(connection, productSQL.productIDQuery, [id]);
    if (isEmpty(product)) return res.status(404).json({message: 'Product not found'});
    await query(connection, productSQL.updateQuery, [new Date(), id]);
    const listProduct = await query(connection, productSQL.getAllProduct);
    res.render('product', {listProduct: listProduct});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//add product
const insertProduct = async (req, res) => {
  const connection = await getConnection(req);
  const listCategory = await query(connection, categorySQL.listNameCategoryQuerySQL);
  res.render('insert_product', {listCategory: listCategory});
};
//ADD Product
const add = async (req, res) => {
  try {
    const data = req.body;
    let {product_name, price, quantityS, quantityM, quantityL, quantityXL} = req.body;
    if (req.files.product_image.data) {
      var productImage = 'data:image/jpeg;base64,' + req.files.product_image.data.toString('base64');
      const upload = await uploadImage(productImage);
      productImage = upload.url;
    }
    if (req.files.image_1.data) {
      var image1 = 'data:image/jpeg;base64,' + req.files.image_1.data.toString('base64');
      const upload = await uploadImage(image1);
      image1 = upload.url;
    }
    if (req.files.image_2.data) {
      var image2 = 'data:image/jpeg;base64,' + req.files.image_2.data.toString('base64');
      const upload = await uploadImage(image2);
      image2 = upload.url;
    }

    if (req.files.image_3.data) {
      var image3 = 'data:image/jpeg;base64,' + req.files.image_3.data.toString('base64');
      const upload = await uploadImage(productImage);
      image3 = upload.url;
    }
    const connection = await getConnection(req);
    const categoryQueryID = 'SELECT category_id FROM category WHERE category_name=?';
    const category = await query(connection, categoryQueryID, [data.category_name]);
    const product = await query(connection, productSQL.productQuery, [product_name]);
    if (!isEmpty(product)) return res.status(409).json({message: 'Sản Phẩm Đã TỒn Tại'});
    const lengthListProduct = (await query(connection, productSQL.getLengthListProduct)).length;
    console.log(lengthListProduct);
    const id = 'SP' + (lengthListProduct + 1);
    await query(connection, productSQL.insertProductQuery, {
      product_id: id,
      product_name,
      category_id: category[0].category_id,
      price: price,
      quantity_sold: 0,
      product_image: productImage,
      product_bgr1: image1,
      product_bgr2: image2,
      product_bgr3: image3,
      created_at: new Date(),
    });

    const listSize = ['S', 'M', 'L', 'XL'];
    const listQuantity = [quantityS, quantityM, quantityL, quantityXL];
    for (const [index, size] of listSize.entries()) {
      await query(connection, sizeSQL.insertSizeSQL, {
        product_id: id,
        size: size,
        quantity: listQuantity[index],
        created_at: new Date(),
      });
    }

    const listProduct = await query(connection, productSQL.getAllProduct);
    res.render('product', {listProduct: listProduct});
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: `${e}`});
  }
};
const search = async (req, res) => {
  const data = req.body;
  const connection = await getConnection(req);
  const search = 'select *  from product where deleted_at is null and product_name=? ';
  const listProduct = await query(connection, search, [data.product_name]);
  res.render('product', {listProduct: listProduct});
};

const listProductCreated = async (req, res) => {
  const connection = await getConnection(req);
  const listProduct = await query(connection, productSQL.getNewProduct);
  res.render('product', {listProduct: listProduct});
};

const listProductDeleted = async (req, res) => {
  const connection = await getConnection(req);
  const listProduct = await query(connection, productSQL.getProductDeleted);
  res.render('product', {listProduct: listProduct});
};
const productDetail = async (req, res) => {
  const product_id = req.params.id;
  const connection = await getConnection(req);
  const detailProductQuery = 'select *  from product where  product_id=?';
  const sizeQuery = 'SELECT *FROM size WHERE product_id=?';
  const product = await query(connection, detailProductQuery, [product_id]);
  const listSize = await query(connection, sizeQuery, [product_id]);
  if (product[0].created_at) {
    product[0].created_at = moment(product[0].created_at).format('DD-MM-YYYY');
  }
  res.render('detail_product', {product: product[0], listSizeProduct: listSize});
};

const getUpdate = async (req, res) => {
  const data = req.params;
  const connection = await getConnection(req);
  const search = 'select *  from product where  product_id=?';
  const querySize = 'select *from size where product_id=?';
  const product = await query(connection, search, [data.id]);
  const listSize = await query(connection, querySize, [data.id]);
  res.render('update_product', {product: product[0], listSize: listSize});
};

const update = async (req, res) => {
  const data = req.body;
  const connection = await getConnection(req);
  const listSize = ['S', 'M', 'L', 'XL'];
  const updateSizeProduct = 'UPDATE size SET quantity=? where size=? and product_id=?';
  for (const [index, size] of listSize.entries()) {
    await query(connection, updateSizeProduct, [data.quantity[index], size, data.product_id]);
  }
  const listProduct = await query(connection, productSQL.getAllProduct);
  res.render('product', {listProduct: listProduct});
};

// API MOBILE
const getAllProductByCategory = async (req, res) => {
  try {
    const connection = await getConnection(req);
    const listCategory = await query(connection, categorySQL.queryListCategory);
    const listAllProduct = [];

    for (const category of listCategory) {
      const listProduct = await query(connection, productSQL.queryProductByCategory, [category.category_id]);
      listAllProduct.push(listProduct);
    }
    console.log(listAllProduct);
    return res.status(200).json({message: 'success', listAllProduct: listAllProduct});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
const getProductDetail = async (req, res) => {
  try {
    const {id} = req.params;
    const connection = await getConnection(req);
    const product = await query(connection, productSQL.getDetailProduct, [id]);
    if (isEmpty(product)) {
      return res.status(404).json({message: 'Product not found'});
    }
    const listSize = await query(connection, productSQL.getListSizeDetailProduct, [id]);
    return res.status(200).json({product, listSize});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//Tất cả sp giảm giá (Màn Home)
const getProductDiscount = async (req, res) => {
  try {
    const connection = await getConnection(req);
    const getProductDiscount = `SELECT product.product_id ,product.product_name, product.price , product.product_image , product.discount
    FROM product , category 
    WHERE product.category_id=category.category_id  AND product.discount BETWEEN 0  AND 99 AND product.deleted_at IS null AND category.deleted_at IS null 
    ORDER BY product.discount DESC `;
    const listProductDiscount = await query(connection, getProductDiscount);
    return res.status(200).json({
      message: 'success',
      listProduct: listProductDiscount,
    });
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
// Tất cả sản phẩm giảm giá (Màn xem tất cả,Có phân trang)
const getAllProductDiscount = async (req, res) => {
  try {
    const {price1, price2, sortPrice, sortDiscount, pageNumber} = req.query;
    const connection = await getConnection(req);
    var offset = 0;
    if (pageNumber == 1) {
      offset = 0;
    } else if (pageNumber > 1) {
      offset = (pageNumber - 1) * 10;
    }

    const getAllProductDiscount = `SELECT product.product_id ,product.product_name, product.price , product.product_image , product.discount
    FROM product , category 
    WHERE product.category_id=category.category_id  
    AND product.price BETWEEN ${price1}  AND ${price2} AND product.deleted_at IS null AND category.deleted_at IS null 
    ORDER BY product.discount ${sortDiscount} ,product.price ${sortPrice}`;
    const getProductLimit = `SELECT product.product_id ,product.product_name, product.price , product.product_image , product.discount
    FROM product , category 
    WHERE product.category_id=category.category_id  
    AND product.price BETWEEN ${price1}  AND ${price2} AND product.deleted_at IS null AND category.deleted_at IS null 
    ORDER BY product.discount ${sortDiscount} ,product.price ${sortPrice}
    LIMIT  10
    OFFSET  ${offset}`;

    const listAllProduct = await query(connection, getAllProductDiscount);
    const listProductLimit = await query(connection, getProductLimit);
    return res.status(200).json({
      message: 'success',
      listProduct: listProductLimit,
      totalPage: getTotalPage(listAllProduct.length, 10),
    });
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
//Tất cả sản phẩm theo thể loại ( Có Phân Trang):
const getProductByCategory = async (req, res) => {
  try {
    const {category_id, price1, price2, sortPrice, sortDiscount, pageNumber} = req.query;
    const connection = await getConnection(req);
    var offset = 0;
    if (pageNumber == 1) {
      offset = 0;
    } else if (pageNumber > 1) {
      offset = (pageNumber - 1) * 10;
    }
    const getAllProductDiscount = `SELECT product.product_id ,product.product_name, product.price , product.product_image , product.discount
    FROM product , category 
    WHERE product.category_id=category.category_id
    AND category.category_id = ${category_id}
    AND product.price BETWEEN ${price1}  AND ${price2} AND product.deleted_at IS null AND category.deleted_at IS null 
    ORDER BY product.discount ${sortDiscount} ,product.price ${sortPrice}`;
    const getProductLimit = `SELECT product.product_id ,product.product_name, product.price , product.product_image , product.discount
    FROM product , category 
    WHERE product.category_id=category.category_id  
    AND category.category_id = ${category_id}
    AND product.price BETWEEN ${price1}  AND ${price2} AND product.deleted_at IS null AND category.deleted_at IS null 
    ORDER BY product.discount ${sortDiscount} ,product.price ${sortPrice}
    LIMIT  10
    OFFSET  ${offset}`;
    const listAllProduct = await query(connection, getAllProductDiscount);
    const listProductLimit = await query(connection, getProductLimit);

    return res.status(200).json({
      message: 'success',
      listProduct: listProductLimit,
      totalPage: getTotalPage(listAllProduct.length, 10),
    });
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

module.exports = {
  getAllProductDiscount,
  getProductDiscount,
  update,
  getUpdate,
  listProductCreated,
  insertProduct,
  add,
  getAllProductByCategory,
  getProductByCategory,
  getProductDetail,
  search,
  listProductDeleted,
  productDetail,
  product,
  removeProduct,
};

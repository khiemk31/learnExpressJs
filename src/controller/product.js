const {isEmpty} = require('../utils/validate');
const productSQL = require('../sql/productSQL');
const sizeSQL = require('../sql/sizeSQL');
const categorySQL = require('../sql/categorySQL');
const {getConnection, query} = require('../utils/database');
const {v4: uuid} = require('uuid');
const {uploadImage} = require('../utils/image');

//ADD Product
const add = async (req, res) => {
  try {
    let {product_name, category_id, price, product_image, listSize, listquantity} = req.body;

    // const {url} = await uploadImage(product_image);
    if (product_image && !product_image.match('https://.*')) {
      const upload = await uploadImage(product_image);
      product_image = upload.url;
    }
    const connection = await getConnection(req);
    const category = await query(connection, categorySQL.categoryQueryByIdSQL, [category_id]);
    if (isEmpty(category)) return res.status(404).json({message: 'Category not found'});
    const product = await query(connection, productSQL.productQuery, [product_name]);
    if (!isEmpty(product)) return res.status(409).json({message: 'Product name existed'});
    const newProductId = uuid();
    await query(connection, productSQL.insertProductQuery, {
      product_id: newProductId,
      product_name,
      category_id,
      sold_quantity: 0,
      price,
      product_image,
      created_at: new Date(),
    });
    for (const [index, size] of listSize.entries()) {
      console.log(listquantity[index]);
      await query(connection, sizeSQL.insertSizeSQL, {
        size_id: uuid(),
        product_id: newProductId,
        size: size,
        quantity: listquantity[index],
        created_at: new Date(),
      });
    }
    return res.status(200).json({message: 'success'});
    return res.json(url);
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: `${e}`});
  }
};

const getList = async (req, res) => {
  try {
    console.log('run roofi ');

    const connection = await getConnection(req);
    const listProduct = await query(connection, productSQL.getAllProduct);
    return res.status(200).json({
      // message: 'success',
      data: listProduct,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: `${e}`});
  }
};
const getProductByCategory = async (req, res) => {
  try {
    let {category_id} = req.body;
    console.log(category_id);
    queryProductByCategory = `SELECT product.product_id ,product.product_name, product.product_image , product.price , size.size , size.quantity from 
    (( product INNER JOIN category ON product.category_id = category.category_id)
     INNER JOIN size on product.product_id = size.product_id)
     WHERE category.category_id = ${category_id} AND  product.deleted_at is null `;
    const connection = await getConnection(req);
    const listProduct = await query(connection, queryProductByCategory);
    return res.status(200).json({data: listProduct});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const remove = async (req, res) => {
  try {
    const {role} = req.body;
    const product_id = req.params.id;
    console.log(role)
    if (role !== 'admin' && role !== 'supper admin') return res.status(403).json({message: 'You don’t have permission to access'});
    const connection = await getConnection(req);
    const product = await query(connection, productSQL.productIDQuery, [product_id]);
    if (isEmpty(product)) return res.status(404).json({message: 'Product not found'});
    await query(connection, productSQL.updateQuery, [new Date(), product_id]);
    return res.status(200).json({message: 'success'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

module.exports = {add, getList,getProductByCategory,remove};

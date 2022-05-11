const {isEmpty} = require('../utils/validate');
const productSQL = require('../sql/productSQL');
const sizeSQL = require('../sql/sizeSQL');
const categorySQL = require('../sql/categorySQL');
const {getConnection, query} = require('../utils/database');
const {v4: uuid} = require('uuid');

//ADD Product
const add = async (req, res) => {
  try {
    let {product_name, category_id, price, product_image, listSize, listquantity} = req.body;

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
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: `${e}`});
  }
};

const remove = async (req, res) => {
  try {
    const {role} = req;
    const product_id = req.params.id;
    if (role !== 'admin' && role !== 'supper admin')
      return res.status(403).json({message: 'You don’t have permission to access'});
    const connection = await getConnection(req);
    const product = await query(connection, productIDQuery, [product_id]);
    if (isEmpty(product)) return res.status(404).json({message: 'Product not found'});
    await query(connection, updateQuery, [new Date(), product_id]);
    return res.status(201).json({message: 'success'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

module.exports = {add};

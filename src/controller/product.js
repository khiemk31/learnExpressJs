const {isEmpty} = require('../utils/validate');
const productSQL = require('../sql/productSQL');
const {getConnection, query} = require('../utils/database');
const {v4: uuid} = require('uuid');

//ADD Product
const add = async (req, res) => {
  try {
    let { product_name, category_id, size_id, price ,product_image} = req.body;
   
    if (product_image && !product_image.match('https://.*')) {
      const upload = await uploadImage(product_image);
      product_image = upload.url;
    }
    const connection = await getConnection(req);
    const category = await query(connection, categoryQuery, [category_id]);
    if (isEmpty(category)) return res.status(404).json({message: 'Category not found'});
    const product = await query(connection, productQuery, [product_name]);
    if (!isEmpty(product)) return res.status(409).json({message: 'Product name existed'});
    const newProductId = uuid();
    await query(connection, insertProductQuery, {
      product_id: newProductId,
      product_name,
      category_id,
      size_id,
      price,
      product_image,
      created_at: new Date(),
    });
      for (const size of color.sizeTable) {
        await query(connection, insertSizeQuery, {
          size_id: uuidv4(),
          color_id: color_id,
          size: size.size,
          sold_quantity: 0,
          import_quantity: size.import_quantity,
          created_at: new Date(),
        });
      }
    return res.status(201).json({message: 'success'});
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: `${e}`});
  }
};

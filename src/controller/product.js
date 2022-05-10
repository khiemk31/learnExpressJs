const isEmpty = require('../utils/validate');
const UserSQL = require('../sql/productSQL');
const {getConnection, query} = require('../utils/database');
//ADD Product
const addProduct = async (req, res) => {
    try {
      const { role } = req;
      let { product_id , product_name, size_id, price, product_image } = req.body;
      if (role !== 'admin') return res.status(403).json({ message: 'You don’t have permission to access' });
      if (image && !image.match('https://.*')) {
        const upload = await uploadImage(image);
        image = upload.url;
      }
      const connection = await getConnection(req);
      const category = await query(connection, categoryQuery, [category_id]);
      if (isEmpty(category)) return res.status(404).json({ message: 'Category not found' });
      const product = await query(connection, productQuery, [product_name]);
      if (!isEmpty(product)) return res.status(409).json({ message: 'Product name existed' });
      const newProductId = uuidv4();
      await query(connection, insertProductQuery, {
        product_id: newProductId,
        product_name,
        description,
        price,
        sale_off,
        image,
        category_id,
        created_at: new Date(),
      });
      for (const color of colorTable) {
        const color_id = uuidv4();
        await query(connection, insertColorQuery, { color_id, product_id: newProductId, color: color.color, created_at: new Date() });
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
      }
      return res.status(201).json({ message: 'success' });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: `${e}` });
    }
  };
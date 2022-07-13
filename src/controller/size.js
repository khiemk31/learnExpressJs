const {isEmpty} = require('../utils/validate');
const {getConnection, query} = require('../utils/database');
const {insertSizeSQL, updateSizeQuery, getSizeQuery, removeSizeQuery, selectSizeByIdQuery} = require('../sql/sizeSQL');

const insertSize = async (req, res) => {
  try {
    const {product_id, size, quantity} = req.body;
    const connection = await getConnection(req);

    const checkSize = await query(connection, getSizeQuery, size);
    if (!isEmpty(checkSize)) return res.status(404).json({message: 'Size existed'});
    await query(connection, insertSizeSQL, {
      size,
      product_id,
      quantity,
      created_at: new Date(),
    });
    return res.status(200).json({message: 'success'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const update = async (req, res) => {
  try {
    const {permission	} = req;
    const size_id = req.params.id;
    const data = req.body;
    if (permission	 !== 'admin') return res.status(403).json({message: "You don't have permission to access"});
    const connection = await getConnection(req);
    const getSize = await query(connection, selectSizeByIdQuery, [size_id]);
    if (isEmpty(getSize)) return res.status(404).json({message: 'size not found'});
    if (size !== getSize[0].size) {
      const conflictSize = await query(connection, selectConflictSize, [sizes[0].color_id, size]);
      if (!isEmpty(conflictSize)) return res.status(409).json({message: 'Size existed'});
    }
    data.updated_at = new Date();
    await query(connection, updateSizeQuery, [data, size_id]);
    return res.status(201).json({message: 'success'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const remove = async (req, res) => {
  try {
    const {permission	} = req;
    const size_id = req.params.id;
    const connection = await getConnection(req);
    if (permission	 !== 'admin') return res.status(403).json({message: "You don't have permission to access"});
    const sizes = await query(connection, selectSizeByIdQuery, [size_id]);
    if (isEmpty(sizes)) return res.status(404).json({message: 'size not found'});
    await query(connection, removeSizeQuery, [new Date(), size_id]);
    return res.status(200).json({message: 'success'});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};
module.exports = {insertSize, update, remove};

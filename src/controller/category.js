const {isEmpty} = require('../utils/validate');
const {v4: uuid} = require('uuid');
const {getConnection, query} = require('../utils/database');
const categorySQL = require('../sql/categorySQL');

const add = async (req, res) => {
  try {
    const {category_name} = req.body;
    const connection = await getConnection(req);
    const category = await query(connection, categorySQL.categoryQueryByNameSQL, [category_name]);
    if (!isEmpty(category)) {
      return res.status(404).json({message: 'Đã tồn tại '});
    } else {
      await query(connection, categorySQL.insertcategorySQL, {
        id: uuid(),
        category_name: category_name,
        created_at: new Date(),
      });
      return res.status(200).json({message: 'Thêm thành công'});
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: `${e}`});
  }
};

const getAll = async (req, res) => {
  try {
    const connection = await getConnection(req);
    const category = await query(connection, categorySQL.listCategoryQuerySQL);
    return res.status(200).json({message: 'thành công', data: category});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    console.log('123321', id);
    const categoryQuery = 'select * from category where category_id=? and deleted_at is null';
    const updateCategoryQuery = 'update category set ? where category_id=?';
    // const {role} = req;
    // if (role.partInt !== 0) return res.status(403).json({message: 'Bạn không có quyền sửa'});
    const connection = await getConnection(req);
    const category = await query(connection, categoryQuery, id);
    if (isEmpty(category)) {
      console.log(id);
      return res.status(404).json({message: 'Category not found'});
    } else {
      data.category_name = category_name;
      data.updated_at = new Date();
      await query(connection, updateCategoryQuery, [data, id]);
      return res.status(200).json({message: 'success'});
    }
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

const remove = async (req, res) => {
  try {
    const {id, role} = req.params;
    // const {role} = req;

    // if (role.parseInt !== 0) return res.status(403).json({message: 'Không có quyền xóa'});
    const connection = await getConnection(req);
    const category = await query(connection, categorySQL.categoryQueryByIdSQL, [id]);
    if (isEmpty(category)) {
      res.status(404).json({message: 'Không tồn tại'});
    } else {
      await query(connection, categorySQL.deleteCategorySQL, [new Date(), id]);
      return res.status(200).json({message: 'thành công'});
    }
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

module.exports = {add, getAll, update, remove};

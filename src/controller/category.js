const {isEmpty} = require('../utils/validate');
const {getConnection, query} = require('../utils/database');
const categorySQL = require('../sql/categorySQL');
const moment = require('moment');
const {uploadImage} = require('../utils/image');
//Web View
//Category
const getAddCategory = async (req, res) => {
  res.render('insert_category');
};
const addCategory = async (req, res) => {
  try {
    const data = req.body;

    if (req.files.category_image.data) {
      var categoryImage = 'data:image/jpeg;base64,' + req.files.category_image.data.toString('base64');
      const upload = await uploadImage(categoryImage);
      categoryImage = upload.url;
    }
    console.log(categoryImage);

    const connection = await getConnection(req);
    const category = await query(connection, categorySQL.categoryQueryByNameSQL, [data.category_name]);
    if (!isEmpty(category)) {
      return res.status(404).json({message: 'Đã tồn tại '});
    } else {
      await query(connection, categorySQL.insertCategorySQL, {
        category_name: data.category_name,
        category_image: categoryImage,
        created_at: new Date(),
      });
      const listCategory = await query(connection, categorySQL.queryListCategory);
      for (const category of listCategory) {
        if (category.created_at) {
          category.created_at = moment(category.created_at).format('DD-MM-YYYY');
        }
        if (category.updated_at) {
          category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
        }
        if (category.deleted_at) {
          category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
        }
      }
      res.render('category', {listCategory: listCategory});
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({message: `${e}`});
  }
};
//Tìm kiếm
const search = async (req, res) => {
  const data = req.body;
  const connection = await getConnection(req);
  const search = `select *  from category where category_name=?`;
  const listCategory = await query(connection, search, [data.category_name]);
  for (const category of listCategory) {
    if (category.created_at) {
      category.created_at = moment(category.created_at).format('DD-MM-YYYY');
    }
    if (category.updated_at) {
      category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
    }
    if (category.deleted_at) {
      category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
    }
  }
  res.render('category', {listCategory: listCategory});
};

//Lấy ds thể loại
const category = async (req, res) => {
  const connection = await getConnection(req);
  const listCategory = await query(connection, categorySQL.listCategoryQuerySQL);
  for (const category of listCategory) {
    if (category.created_at != null) {
      category.created_at = moment(category.created_at).format('DD-MM-YYYY');
    }
    if (category.updated_at != null) {
      category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
    }
    if (category.deleted_at != null) {
      category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
    }
  }
  res.render('category', {listCategory: listCategory});
};
//Xóa thể loại
const removeCategory = async (req, res) => {
  // const {permission} = req;
  const {id} = req.params;
  // if (permission !== 'super admin') return res.status(403).json({message: 'Không có quyền xóa'});
  const connection = await getConnection(req);
  await query(connection, categorySQL.deleteCategorySQL, [new Date(), id]);
  const listCategory = await query(connection, categorySQL.listCategoryQuerySQL);
  for (const category of listCategory) {
    if (category.created_at) {
      category.created_at = moment(category.created_at).format('DD-MM-YYYY');
    }
    if (category.updated_at) {
      category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
    }
    if (category.deleted_at) {
      category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
    }
  }
  res.render('category', {listCategory: listCategory});
};
// Thể loại đã xóa
const getCategoryDeleted = async (req, res) => {
  const connection = await getConnection(req);
  const listCategory = await query(connection, categorySQL.listCategoryDeleted);
  for (const category of listCategory) {
    if (category.created_at) {
      category.created_at = moment(category.created_at).format('DD-MM-YYYY');
    }
    if (category.updated_at) {
      category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
    }
    if (category.deleted_at) {
      category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
    }
  }
  res.render('category', {listCategory: listCategory});
};
//Thể loại đã Sửa
const getCategoryUpdated = async (req, res) => {
  const connection = await getConnection(req);
  const listCategory = await query(connection, categorySQL.listCategoryUpdated);
  for (const category of listCategory) {
    if (category.created_at) {
      category.created_at = moment(category.created_at).format('DD-MM-YYYY');
    }
    if (category.updated_at) {
      category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
    }
    if (category.deleted_at) {
      category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
    }
  }
  res.render('category', {listCategory: listCategory});
};
// Theo ngày tạo mới nhất
const getCategoryCreated = async (req, res) => {
  const connection = await getConnection(req);
  const listCategory = await query(connection, categorySQL.listCategoryCreated);
  for (const category of listCategory) {
    if (category.created_at) {
      category.created_at = moment(category.created_at).format('DD-MM-YYYY');
    }
    if (category.updated_at) {
      category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
    }
    if (category.deleted_at) {
      category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
    }
  }
  res.render('category', {listCategory: listCategory});
};
//View Update thể loại
const getUpdateCategory = async (req, res) => {
  const data = req.params;
  const connection = await getConnection(req);
  const search = 'select *  from category where  category_id=?';
  const listCategory = await query(connection, search, [data.id]);
  console.log(listCategory);
  res.render('update_category', {category: listCategory[0]});
};
//update thể loại
const update = async (req, res) => {
  const data = req.body;
  const connection = await getConnection(req);
  const updateCategoryQuery = `update category set category_name='${data.category_name}',updated_at=? where category_id='${data.category_id}'`;
  await query(connection, updateCategoryQuery, [new Date()]);
  const listCategory = await query(connection, categorySQL.listCategoryQuerySQL);
  for (const category of listCategory) {
    if (category.created_at) {
      category.created_at = moment(category.created_at).format('DD-MM-YYYY');
    }
    if (category.updated_at) {
      category.updated_at = moment(category.updated_at).format('DD-MM-YYYY');
    }
    if (category.deleted_at) {
      category.deleted_at = moment(category.deleted_at).format('DD-MM-YYYY');
    }
  }
  res.render('category', {listCategory: listCategory});
};
//API Category
//Lấy tất cả
const getAll = async (req, res) => {
  try {
    const connection = await getConnection(req);
    const category = await query(connection, categorySQL.listCategoryQuerySQL);
    return res.status(200).json({message: 'thành công', data: category});
  } catch (e) {
    return res.status(500).json({message: `${e}`});
  }
};

module.exports = {
  getAll,
  getCategoryUpdated,
  getCategoryCreated,
  getCategoryDeleted,
  update,
  addCategory,
  getAddCategory,
  getUpdateCategory,
  category,
  removeCategory,
  search,
};

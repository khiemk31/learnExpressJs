const user = require('./controller/user');
const category = require('./controller/category');
const size = require('./controller/size');
const product = require('./controller/product');
module.exports = (router) => {
  //User
  router.post('/user/register', user.register);
  router.post('/user/registerAdmin', user.registerAdmin);
  router.post('/user/login', user.login);

  router.post('/user/loginAdmin', user.loginAdmin);
  router.put('/user/recoveryPass', user.recoveryPassword);
  router.put('/user/update', user.update);
  router.get('/user/getAllUser', user.getAllUser);
  router.get('/user/detail', user.detail);
  router.delete('/user/remove/:id', user.remove);
  router.post('/user/send-otp', user.sendOTPAPI);
  router.post('/user/verify-otp', user.verifyOTP);
  //Category
  router.post('/category/add', category.add);
  router.get('/category/getAll', category.getAll);
  router.post('/category/update', category.update);
  router.delete('/category/remove/:id', category.remove);
  //Size
  router.post('/size/add', size.insertSize);
  //Product
  router.post('/product/add', product.add);
  router.get('/product/getAll', product.getList);
  router.get('/product/getProductByCategory', product.getProductByCategory);
  router.delete('/product/remove/:id', product.remove);
};

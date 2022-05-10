const user = require('./controller/user');
const category = require('./controller/category');
module.exports = (router) => {
  //User
  router.post('/user/register', user.register);
  router.post('/user/registerAdmin', user.registerAdmin);
  router.post('/user/login', user.login);
  router.post('/user/loginAdmin', user.loginAdmin);
  router.put('/user/recoveryPass', user.recoveryPassword);
  router.put('/user/update', user.update);
  //Category
  router.post('/category/add', category.add);
  router.get('/category/getAll', category.getAll);
  router.post('/category/update', category.update);
  router.delete('/category/remove/:id', category.remove);
};

const user = require('./controller/user');

module.exports = (router) => {
  router.post('/user/register', user.register);
  router.post('/user/registerAdmin',user.registerAdmin);
  router.post('/user/login', user.login);
  router.post('/user/loginAdmin',user.loginAdmin);
  router.post('/user/recoveryPass',user.recoveryPassword);
  router.post('/user/update',user.update);
};

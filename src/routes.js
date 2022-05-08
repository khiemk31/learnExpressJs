const user = require('./controller/user');

module.exports = (router) => {
  router.post('/user/register', user.register);
};

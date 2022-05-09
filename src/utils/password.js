const bcrypt = require('bcryptjs');
const {isEmpty} = require('../utils/validate');

const encodePassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8, function (error, hash) {
      if (hash) {
        resolve(hash);
      } else {
        reject(`Encode failed ${error}`);
      }
    });
  });
};

const comparePassword = (user, encodePassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(encodePassword, user.password).then((isValid) => {
      if (!isValid || isEmpty(isValid)) {
        reject('Phone or password incorrect');
      } else {
        resolve();
      }
    });
  });
};

module.exports = {encodePassword, comparePassword};

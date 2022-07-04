import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {private_key, cloudinary} from '../../config';
import {isEmpty} from '../validate';
import {messagingServiceSid} from '../../config';

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
        const token = encodeToken(user.user_id, user.role);
        resolve(token);
      }
    });
  });
};

const encodeToken = (user_id, role) => {
  return jwt.sign(
    {
      user_id,
      role,
      date: new Date(),
    },
    private_key
  );
};

const decodeToken = (token) => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, private_key, async (error, decode) => {
      if (error) {
        reject(`Verify JWT failed ${error}`);
      } else {
        if (isEmpty(decode)) {
          reject(`Verify JWT failed ${error}`);
        } else {
          resolve(decode);
        }
      }
    })
  );
};

const query = (connection, sql, bindings) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, bindings, (error, result) => {
      if (error) {
        reject(`Database failed ${error}`);
      } else {
        resolve(result);
      }
    });
  });
};

export {encodePassword, comparePassword, encodeToken, decodeToken, query, customizeData, encodeOTP, decodeOTP};

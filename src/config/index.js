const {v2: cloudinary} = require('cloudinary');

const port = 3000;

const mysqlConfig = {
  host: 'remotemysql.com',
  user: 'wlD1WQrpl6',
  password: 'j3rtZ01oRj',
  port: 3306,
  database: 'wlD1WQrpl6',
};

cloudinary.config({
  cloud_name: 'cde',
  api_key: '537853312614449',
  api_secret: '__Rb7zY3SQzgNSdlzh3PLP0Jz8Y',
});

const accountSid = 'AC6831336a69e413ddda030af558579bc2';
const messagingServiceSid = 'MG059e5c8e3ed10244b8ad968aabf85591';
const authToken = '90fe6554d2ce805d455c82dd35923066';

const private_key = 'admin';
//tk twilo
// ginhotaru282@gmail.com
// dangtrungkien300197

//cloudinary
//ginhotaru282@gmail.com
// Matkhau123@

module.exports = {port, mysqlConfig, cloudinary, private_key, accountSid, messagingServiceSid, authToken};

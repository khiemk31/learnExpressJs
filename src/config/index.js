const {v2: cloudinary} = require('cloudinary');

const port = 5000;

const mysqlConfig = {
  host: '127.0.0.1',
  user: 'modelfashion',
  password: 'WeT2LX4Xx2kFnkFZ',
  port: 3399,
  database: 'modelfashion',
};

cloudinary.config({
  cloud_name: 'cde',
  api_key: '537853312614449',
  api_secret: '__Rb7zY3SQzgNSdlzh3PLP0Jz8Y',
});

const accountSid = 'AC6831336a69e413ddda030af558579bc2';
const messagingServiceSid = 'MG059e5c8e3ed10244b8ad968aabf85591';
const authToken = '8a99bcc221ee09ee130a519c7996f296';

const private_key = 'admin';
//tk twilo
// ginhotaru282@gmail.com
// dangtrungkien300197

//khiemk31@gmail.com
//nguyenduykhiem171098

//cloudinary
//ginhotaru282@gmail.com
// Matkhau123@

module.exports = {port, mysqlConfig, cloudinary, private_key, accountSid, messagingServiceSid, authToken};

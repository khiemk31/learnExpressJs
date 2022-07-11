const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const myConnection = require('express-myconnection');
var fileupload = require('express-fileupload');
const cors = require('cors');
const {port} = require('./config');
const routes = require('./routes');

const app = express();
const router = express.Router();
const {mysqlConfig} = require('./config');
const connection = myConnection(mysql, mysqlConfig, 'single');
const cookieParser = require('cookie-parser');
require('dotenv').config();

routes(router);

app.set('views', __dirname + '/views'); // Thư mục views nằm cùng cấp với file app.js
app.set('view engine', 'pug'); // Sử dụng pug làm view engine
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(connection);
app.use(express.json({extended: true, limit: '5mb'}));
app.use(fileupload());
app.use(express.urlencoded({extended: true, limit: '5mb'}));
app.use(router);

const server = app.listen(process.env.PORT || port, () => {
  const port = server.address().port;
  console.log(`khởi tạo cổng: ${port}`);
});

const express = require('express');
const mysql = require('mysql');
const morgan = require('morgan');
const myConnection = require('express-myconnection');

const {port} = require('./config');
const routes = require('./routes');

const app = express();
const router = express.Router();
const {mysqlConfig} = require('./config');
const connection = myConnection(mysql, mysqlConfig, 'single');

routes(router);
app.use(morgan('dev'));
app.use(connection);
app.use(express.json({extended: true, limit: '5mb'}));
app.use(express.urlencoded({extended: true, limit: '5mb'}));
app.use(router);

app.listen(port, () => console.log(`khởi tạo cổng : ${port}`));

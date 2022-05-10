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

// app.set('views', __dirname+"/views"); // Thư mục views nằm cùng cấp với file app.js
// app.set('view engine', 'pug'); // Sử dụng pug làm view engine

// app.get('/home', function(req, res){
// 	res.render('main');
// })



// router.get('/',function(req,res){
//    res.sendFile(path.join(__dirname+'/main_page.html'));
//    //__dirname : It will resolve to your project folder.
//  });
app.use(morgan('dev'));
app.use(connection);
app.use(express.json({extended: true, limit: '5mb'}));
app.use(express.urlencoded({extended: true, limit: '5mb'}));
app.use(router);

app.listen(process.env.PORT || port, () => console.log(`khởi tạo cổng: ${port}`));

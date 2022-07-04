const mysql = require('mysql');
const {myConnection} = require('express-myconnection');
const {mysqlConfig} = require('../../config');

const connection = myConnection(mysql, mysqlConfig, 'single');

export default connection;

const wrapper = require('co-mysql'), mysql = require('mysql');
const options = {
  host: 'localhost',
  port: 3306,
  database: 'group',
  user: 'root',
  password: 'root'
};

const pool = mysql.createPool(options);
const db = wrapper(pool);
module.exports = db;
const mysql = require('mysql2');

const pool = mysql.createPool({
    connectionLimit:10,
    host:'10.89.240.71',
    user:'priscila',
    password:'senai@604',
    database:'projeto_senai'
});


module.exports = pool;
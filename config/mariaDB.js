var mysql = require('mysql2/promise');

module.exports = function(){
    var config = {
        host : '192.168.109.132',
        port : 3306,
        user : 'root',
        password : '1234',
        database : 'fabricDB'
    };
    
    var pool = mysql.createPool(config);

    return pool;
}();

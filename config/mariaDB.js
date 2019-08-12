var mysql = require('mysql2/promise');

module.exports = function(){
    var config = {
        host : '192.168.40.128',
        port : 3306,
        user : 'root',
        password : 'icn0690!',
        database : 'pid'
    };
    
    var pool = mysql.createPool(config);

    return pool;
}();
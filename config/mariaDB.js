var mysql = require('mysql2/promise');

module.exports = function(){
    var config = {
        host : '39.115.19.152',
        port : 3306,
        user : 'root',
        password : 'icn0690!',
        database : 'pidDB'
    };
    
    var pool = mysql.createPool(config);

    return pool;
}();

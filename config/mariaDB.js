var mysql = require('mysql');

module.exports = function(){
    var config = {
        host : '192.168.40.128',
        port : 3306,
        user : 'root',
        password : 'icn0690!',
        database : 'pid'
    };
    
    var pool = mysql.createPool(config);

    return {
        getConnection : (callback) => {
            pool.getConnection(callback);
        },
        end : (callback) => {
            pool.end(callback);
        }
    };
}();
var mysql = require('mysql');

module.exports = function(){
    var config = {
        host : '192.168.109.132',
        port : 3306,
        user : 'root',
        password : '1234',
        database : 'fabricDB'
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
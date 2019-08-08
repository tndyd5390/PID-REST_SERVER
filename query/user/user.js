var pool = require('../../config/mariaDB');


// 쿼리 실행 함수
var _query = (sql, callback) =>{
    // 매개변수 : sql, callback 함수
    pool.getConnection((err, conn)=>{
        conn.query(sql, (err, result, fields)=>{
            // 쿼리 수행
            conn.release();
            if(err) return callback(err);
            return callback(null, result);
            // err = null, 결과 값 return
        })
    })
}

var _getUser = (callback) =>{
    var sql = 'select * from USER_INFO';
    // 수행할 sql

    _query(sql, callback);
    // 매개변수 : sql, callback 함수
};

module.exports = () =>{
    return{
        getUser : (callback)=>{
            // callback 함수로 return
            _getUser(callback);
        },
        pool : pool
        // connection close를 위한 pool 함수 return
    }
}
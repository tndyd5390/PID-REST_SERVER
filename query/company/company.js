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

const _getCompanyByAPIKEYandAPISECRET = (API_KEY, API_SECRET, callback) => {
    var sql = 
    `SELECT COMPANY_NO, COMPANY_NAME, COMPANY_ID, COMPANY_API_KEY, COMPANY_API_SECRET FROM COMPANY WHERE COMPANY_API_KEY = "${API_KEY}" AND COMPANY_API_SECRET = "${API_SECRET}"`;
    _query(sql, callback);
}

module.exports = () => {
    return {
        getCompanyByAPIKEYandAPISECRET: (API_KEY, API_SECRET, callback) => {
            _getCompanyByAPIKEYandAPISECRET(API_KEY, API_SECRET, callback);
        },
        pool: pool
    }
}
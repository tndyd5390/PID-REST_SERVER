var pool = require('../../config/mariaDB');


// 쿼리 실행 함수
var _query = async(sql, params) =>{
    var conn = await pool.getConnection(async conn=> conn);
    var [rows] = await conn.query(sql, params);
    conn.release();
    return rows;
}

const _getCompanyByAPIKEYandAPISECRET = async (params) => {
    var sql = 
    `SELECT COMPANY_NO, COMPANY_NAME, COMPANY_ID, COMPANY_API_KEY, COMPANY_API_SECRET FROM COMPANY WHERE COMPANY_API_KEY = ? AND COMPANY_API_SECRET = ?`;
    return await _query(sql, params);
}

module.exports = () => {
    return {
        getCompanyByAPIKEYandAPISECRET: async (params) => {
            return await _getCompanyByAPIKEYandAPISECRET(params);
        },
        pool: pool
    }
}
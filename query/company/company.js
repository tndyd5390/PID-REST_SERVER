var pool = require('../../config/mariaDB');


// 쿼리 실행 함수
var _query = async(sql, params) =>{
    var conn = await pool.getConnection(async conn=> conn);
    console.log(sql);
    var [rows] = await conn.query(sql, params);
    conn.release();
    return rows;
}

const _getCompanyByAPIKEYandAPISECRET = async (params) => {
    var sql = 
    `SELECT COMPANY_NO, COMPANY_NAME, COMPANY_ID, COMPANY_API_KEY, COMPANY_API_SECRET FROM COMPANY WHERE COMPANY_API_KEY = ? AND COMPANY_API_SECRET = ?`;
    return await _query(sql, params);
}

const _insertCompanyJoinRequest = async (params) => {
    var sql = `
        INSERT INTO COMPANY_JOIN_REQ 
        (
            COMPANY_NAME,
            COMPANY_REGISTRATION_NUMBER,
            COMPANY_REPRESENTATIVE_NAME,
            COMPANY_ID,
            COMPANY_PASSWORD,
            COMPANY_POSTCODE,
            COMPANY_ADDRESS,
            COMPANY_ADDRESS_DETAIL,
            COMPANY_REQ_STATUS,
            REG_DATE
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            "1",
            NOW()
        )
    `
    return await _query(sql, params);
}

module.exports = () => {
    return {
        getCompanyByAPIKEYandAPISECRET: async (params) => {
            return await _getCompanyByAPIKEYandAPISECRET(params);
        },
        insertCompanyJoinRequest: async(params) => {
            return await _insertCompanyJoinRequest(params);
        },
        pool: pool
    }
}
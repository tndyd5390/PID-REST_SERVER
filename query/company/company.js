var pool = require('../../config/mariaDB');


// 쿼리 실행 함수
var _query = async(sql, params = []) =>{
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
        INSERT INTO COMPANY
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
    `;
    return await _query(sql, params);
}

const _checkCompanyRegistrationNumber = async (registrationNumber) => {
    var sql = `
        SELECT COMPANY_REGISTRATION_NUMBER
          FROM COMPANY
         WHERE COMPANY_REGISTRATION_NUMBER = ?
    `;
    return await _query(sql, registrationNumber);
}

const _checkCompanyId = async(companyId) => {
    var sql = `
        SELECT COMPANY_ID
          FROM COMPANY
         WHERE COMPANY_ID = ?
    `
    return await _query(sql, companyId);
}

const _getCompanyReqList = async() => {
    var sql = `
        SELECT COMPANY_NO,
               COMPANY_NAME,
               COMPANY_REGISTRATION_NUMBER,
               COMPANY_REPRESENTATIVE_NAME,
               COMPANY_ID,
               COMPANY_PASSWORD,
               COMPANY_POSTCODE,
               COMPANY_ADDRESS,
               COMPANY_ADDRESS_DETAIL
          FROM COMPANY
         WHERE COMPANY_REQ_STATUS = 1
    `;

    return await _query(sql);
}

module.exports = () => {
    return {
        getCompanyByAPIKEYandAPISECRET: async (params) => {
            return await _getCompanyByAPIKEYandAPISECRET(params);
        },
        insertCompanyJoinRequest: async(params) => {
            return await _insertCompanyJoinRequest(params);
        },
        checkCompanyRegistrationNumber: async(registrationNumber) => {
            return await _checkCompanyRegistrationNumber(registrationNumber);
        },
        checkCompanyId: async(companyId) => {
            return await _checkCompanyId(companyId);
        },
        getCompanyReqList: async() => {
            return await _getCompanyReqList();
        },
        pool: pool
    }
}
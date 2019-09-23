var pool = require('../../config/mariaDB');


// 쿼리 실행 함수
var _query = async(sql, params = []) =>{
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

const _insertCompanyJoinRequest = async (params) => {
    var sql = `
        INSERT INTO COMPANY
        (
            COMPANY_NAME,
            COMPANY_REGISTRATION_NUMBER,
            COMPANY_REPRESENTATIVE_NAME,
            COMPANY_CONTACT_NUMBER,
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
            ?,
            "0",
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

const _getCompanyList = async() => {
    var sql = `
        SELECT COMPANY_NO,
               COMPANY_NAME,
               COMPANY_REGISTRATION_NUMBER,
               COMPANY_REPRESENTATIVE_NAME,
               COMPANY_CONTACT_NUMBER,
               COMPANY_ID,
               COMPANY_PASSWORD,
               COMPANY_POSTCODE,
               COMPANY_ADDRESS,
               COMPANY_ADDRESS_DETAIL,
               REG_DATE,
               COMPANY_REQ_STATUS
          FROM COMPANY
    `;

    return await _query(sql);
}

const _getCompanyByCompanyNo = async companyNo => {
    var sql = `
        SELECT COMPANY_NO                   AS companyNo,
               COMPANY_NAME                 AS companyName,
               COMPANY_REGISTRATION_NUMBER  AS companyRegistrationNumber,
               COMPANY_REPRESENTATIVE_NAME  AS companyRepresentativeName,
               COMPANY_CONTACT_NUMBER       AS companyContactNumber,
               COMPANY_ID                   AS companyId,
               COMPANY_POSTCODE             AS companyPostcode,
               COMPANY_ADDRESS              AS companyAddress,
               COMPANY_ADDRESS_DETAIL       AS companyAddressDetail,
               COMPANY_REQ_STATUS           AS companyReqStatus,
               COMPANY_API_KEY              AS companyApiKey,
               COMPANY_API_SECRET           AS companyApiSecret
          FROM COMPANY
         WHERE COMPANY_NO = ?
    `;

    return await _query(sql, companyNo);
}

const _updateCompany = async(companyNo, params) => {
    var sql = `
        UPDATE COMPANY
           SET COMPANY_NAME                 =?,
               COMPANY_REGISTRATION_NUMBER  =?,
               COMPANY_REPRESENTATIVE_NAME  =?,
               COMPANY_CONTACT_NUMBER       =?,
               COMPANY_ID                   =?,
               COMPANY_POSTCODE             =?,
               COMPANY_ADDRESS              =?,
               COMPANY_ADDRESS_DETAIL       =?,
               COMPANY_REQ_STATUS           =?,
               CHG_DATE                     =NOW()
         WHERE COMPANY_NO = "${companyNo}"
    `;
    return await _query(sql, params);
}

const _checkPassword = async(params) => {
    var sql = `
        SELECT COMPANY_NAME
          FROM COMPANY
         WHERE COMPANY_NO = ? AND COMPANY_PASSWORD = ?
    `;

    return await _query(sql, params);
}

const _updatePassword = async(params) => {
    var sql = `
        UPDATE COMPANY
           SET COMPANY_PASSWORD = ?
         WHERE COMPANY_NO = ?
    `;
    return await _query(sql, params);
}

const _updateAPIInfo = async(params) => {
    var sql = `
        UPDATE COMPANY
           SET COMPANY_API_KEY = ?,
               COMPANY_API_SECRET = ?
         WHERE COMPANY_NO = ?
    `;
    return await _query(sql, params);
}

const _updateCompanyReqStatus = async params => {
    var sql = `
        UPDATE COMPANY
           SET COMPANY_REQ_STATUS = ?
         WHERE COMPANY_NO = ?
    `;
    return await _query(sql, params);
}

const _getCompanyReqStatus = async params => {
    var sql = `
        SELECT COMPANY_REQ_STATUS AS companyReqStatus
          FROM COMPANY
         WHERE COMPANY_NO = ?
    `;

    return await _query(sql, params);
}

const _loginProc = async params => {
    var sql = `
        SELECT COMPANY_NO   AS companyNo,
               COMPANY_NAME AS companyName,
               COMPANY_ID   AS companyId
          FROM COMPANY
         WHERE COMPANY_ID = ?
           AND COMPANY_PASSWORD = ?
    `;
    console.log(params);
    console.log(sql);

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
        checkCompanyRegistrationNumber: async(registrationNumber) => {
            return await _checkCompanyRegistrationNumber(registrationNumber);
        },
        checkCompanyId: async(companyId) => {
            return await _checkCompanyId(companyId);
        },
        getCompanyList: async() => {
            return await _getCompanyList();
        },
        getCompanyByCompanyNo: async companyNo => {
            return await _getCompanyByCompanyNo(companyNo);
        },
        updateCompany: async (companyNo, params) => {
            return await _updateCompany(companyNo, params);
        },
        checkPassword: async params => {
            return await _checkPassword(params);
        },
        updatePassword: async params => {
            return await _updatePassword(params);
        },
        updateAPIInfo: async params => {
            return await _updateAPIInfo(params);
        },
        updateCompanyReqStatus: async(params) => {
            return await _updateCompanyReqStatus(params);
        },
        getCompanyReqStatus: async params => {
            return await _getCompanyReqStatus(params);
        },
        loginProc: async params => {
            return await _loginProc(params);
        },
        pool: pool
    }
}
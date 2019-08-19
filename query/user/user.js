var pool = require('../../config/mariaDB');


// 쿼리 실행 함수
var _query = async(sql, params) =>{
    var conn = await pool.getConnection(async conn=> conn);
    var [rows] = await conn.query(sql, params);
    conn.release();
    return rows;
}

var _getUser =  async(params) =>{
    var sql = 'select * from USER_INFO';
    var result = await _query(sql, params);
    return result;
};

var _checkDupEmail= async(params) =>{
    var sql = 'SELECT COUNT(1) AS COUNT FROM USER_INFO WHERE USER_EMAIL = ?';
    var result = await _query(sql, params);
    return result;
}

var _insertUser = async(params) =>{
    var sql = 'INSERT INTO USER_INFO (USER_EMAIL, PASSWORD, MSP_PASSWORD, MSP_AFFILIATION, REG_DATE) VALUES (?, PASSWORD(?), ?, ?,NOW())'
    var result = await _query(sql, params);
    console.log(result);
    return result;
}

module.exports = () =>{
    return{
        getUser : async (params)=>{
            var result = await _getUser(params);
            return result;
        },
        checkDupEmail : async(params)=>{
            var result = await _checkDupEmail(params);
            return result;
        },
        insertUser : async(params)=>{
            var result = await _insertUser(params);
            return result;
        }
    }
}
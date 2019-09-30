var express = require('express');
var router = express.Router();
var enrollAdmin = require('../fabricSDK/user/enrollAdmin');
var query = require("../fabricSDK/personalCC/personalccQuery");
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const companyQuery = require("../query/company/company")();
var async = require("async");
const crypto = require("../crypto");

_verifyToken = (token) => {
    try{
        var decoded = jwt.verify(token, secretObj.secret);
        if(decoded){
            return true;
        }else{
            return false;
        }
    }catch(err) {
        return false;
    }
}

router.post('/registerUser', async function(req, res, next) {
    var {body} = req;
    var secret = await enrollAdmin.registerUser('admin',body.user, body.affiliation);
    res.send(secret);
});

router.post("/getToken", async (req, res) => {
    const {body: {API_KEY, API_SECRET}} = req;
    var result = await companyQuery.getCompanyByAPIKEYandAPISECRET([API_KEY,API_SECRET]);
    if(result.length == 1) {
        let token = jwt.sign(
            {
                API_KEY,
                API_SECRET
            },
            secretObj.secret,
            {
                expiresIn: "3m"
            }
        );
        res.send(token);
    } else {
        res.send(null);
    }
})

router.post("/verifyToken", async(req, res) => {
    const{body: {token}} = req;
    res.send(_verifyToken(token));
})

router.post("/getPersonalInfoByIdentifier", async(req, res) => {
    const {body: {identifier}} = req;
    var token = req.get("authorization");
    console.log(token);
    if(!_verifyToken(token)){
        res.send("Invalid token");
        return;
    }
    var result = await query.getPersonalInfoByIdentifier(
        "admin",
        {
            identifier,
            logs: "what the fucka"
        }
    );
    res.send(result);
})

router.post("/", async(req, res) => {
    var { body: {
        companyName,
        companyRegistrationNumber,
        companyRepresentativeName,
        companyContactNumber,
        companyId,
        password,
        companyPostCode,
        address,
        addressDetail
    }} = req;
    var params = [
        companyName,
        companyRegistrationNumber,
        companyRepresentativeName,
        companyContactNumber,
        companyId,
        password,
        companyPostCode,
        address,
        addressDetail,
        "1"
    ];
    var insertQuery = await companyQuery.insertCompanyJoinRequest(params);
    res.send("true");
})

router.get("/checkCompanyRegistrationNumber/:registrationNumber", async(req, res) => {
    var {params:{registrationNumber}} = req;
    var selectQuery = await companyQuery.checkCompanyRegistrationNumber(registrationNumber);
    res.send(String(selectQuery.length));
})

router.get("/checkCompanyId/:companyId", async(req, res) => {
    var {params: {companyId}} = req;
    var queryResult = await companyQuery.checkCompanyId(companyId);
    res.send(String(queryResult.length));
})

router.get("/", async(req, res) => {
    var queryResult = await companyQuery.getCompanyList();
    res.send(queryResult);
})

router.get("/:companyNo", async(req, res) => {
    var {params: {companyNo}} = req;
    var queryResult = await companyQuery.getCompanyByCompanyNo(companyNo);
    res.send(queryResult[0]);
})

router.post("/approveCompanyJoin", async(req, res) => {
    var {body: {companyNo}} = req;
    var selectQuery = await companyQuery.getCompanyByCompanyNo(companyNo);
    try{
        var API_KEY = await crypto.SHA256Encode(selectQuery[0].companyRegistrationNumber);
        var API_SECRET = await crypto.AESEncode(
            selectQuery[0].companyNo + 
            selectQuery[0].companyName + 
            selectQuery[0].companyRegistrationNumber + 
            selectQuery[0].companyRepresentativeName + 
            selectQuery[0].companyContactNumber + 
            selectQuery[0].companyPostcode + 
            selectQuery[0].companyAddress + 
            selectQuery[0].companyAddressDetail,
            API_KEY
        );
        var APIupdateResult = await companyQuery.updateAPIInfo([API_KEY, API_SECRET, companyNo]);
        var statusUpdateResult = await companyQuery.updateCompanyReqStatus([1, companyNo]);
        if(APIupdateResult.changedRows == 1 && statusUpdateResult.changedRows == 1){
            res.send(true);
        } else {
            res.send(false);
        }
    }catch(err){ 
        console.log(err);
    }
})

router.put("/:companyNo", async(req, res) => {
    var {params: {companyNo}} = req;
    var {body: {companyObj}} = req;
    var targetCompany = await companyQuery.getCompanyByCompanyNo(companyNo);
    var updateCompanyObj = Object.assign({}, targetCompany[0], companyObj);
    var updateResult = await companyQuery.updateCompany(companyNo, updateCompanyObj);
    if(updateResult.changedRows != 0) {
        res.send(true);
    } else {
        res.send(false);
    }
})

router.post("/checkPassword", async(req,res) => {
    var{body: {companyNo, password}} = req;
    var selectQuery = await companyQuery.checkPassword([companyNo, password]);
    if(selectQuery.length === 1) res.send(true);
    else res.send(false);
})

router.post("/updatePassword", async(req, res) => {
    var {body: {companyNo, newPassword}} = req;
    var updateQuery = await companyQuery.updatePassword([newPassword, companyNo]);
    if(updateQuery.changedRows != 0){
        res.send(true);
    } else {
        res.send(false);
    }
})

router.post("/getCompanyReqStatus", async(req, res) => {
    var {body: {companyNo}} = req;
    var selectQuery = await companyQuery.getCompanyReqStatus([companyNo]);
    res.send(selectQuery[0].companyReqStatus);
})

router.post("/loginProc", async(req, res) => {
    var {body: {id, password}} = req;
    var selectQuery = await companyQuery.loginProc([id, password]);
    console.log(selectQuery);
    if(selectQuery.length > 0){
        res.send(selectQuery[0]);
    }else {
        res.send(null);
    }
})

module.exports = router;
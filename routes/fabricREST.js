var express = require('express');
var router = express.Router();
var enrollAdmin = require('../fabricSDK/user/enrollAdmin');
var query = require("../fabricSDK/personalCC/personalccQuery");
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const companyQuery = require("../query/company/company")();
var async = require("async");

_verifyToken = (token) => {
    try{
        var decoded = jwt.verify(token, secretObj.secret);
        if(decoded){
            return false;
        }else{
            return true;
        }
    }catch(err) {
        console.log(err);
        return true;
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
    if(_verifyToken(token)){
        res.send("Invalid token");
        return;
    }
    var result = await query.getPersonalInfoByIdentifier(
        "user2",
        {
            identifier,
            logs: "what the fucka"
        }
    );
    res.send(result);
})

module.exports = router;

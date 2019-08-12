var express = require('express');
var router = express.Router();
var enrollAdmin = require('../fabricSDK/user/enrollAdmin');
var query = require("../fabricSDK/personalCC/personalccQuery");
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");
const companyQuery = require("../query/company/company")();
var async = require("async");

router.post('/registerUser', async function(req, res, next) {
    var {body} = req;
    var secret = await enrollAdmin.registerUser('admin',body.user, body.affiliation);
    res.send(secret);
});

router.post("/getToken", async (req, res) => {
    const {body: {API_KEY, API_SECRET}} = req;
    var result;
    async.waterfall(
        [
            (callback) => {
                companyQuery.getCompanyByAPIKEYandAPISECRET(API_KEY, API_SECRET, (err, result) => {
                    if(err) return callback(err);
                    callback(null, result);
                })

            },
            (data, callback) => {
                res.send(data);
                callback(null, data);
            }
        ],
        (err, data) => {
            if(err)console.log(err);
            else {
                console.log("111");
                result = data;
                console.log("222");
            }
        }
    )
    console.log("fff");
    console.log(result);


    // let token = jwt.sign(
    //     {
    //         API_KEY,
    //         API_SECRET
    //     },
    //     secretObj.secret,
    //     {
    //         expiresIn: "3m"
    //     }
    // );

})

router.get("/getPersonalInfoByIdentifier/:identifier", async(req, res) => {
    const {params: {id}} = req;
    var result = await query.getPersonalInfoByIdentifier(
        "user2",
        {
            identifier: "identifier1",
            logs: "what the fuck"
        }
    );
    //res.render("index", {title: result});
    res.send(result);
})

module.exports = router;

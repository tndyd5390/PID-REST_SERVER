var express = require('express');
var router = express.Router();
var enrollAdmin = require('../fabricSDK/user/enrollAdmin');
var query = require("../fabricSDK/personalCC/personalccQuery");

router.post('/registerUser', async function(req, res, next) {
    var {body} = req;
    var secret = await enrollAdmin.registerUser('admin',body.user, body.affiliation);
    res.send(secret);
});

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

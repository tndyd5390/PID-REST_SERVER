var express = require('express');
var router = express.Router();
var userQuery = require('../query/user/user')();
var enrollAdmin = require('../fabricSDK/user/enrollAdmin');

router.post('/registerUser', async (req, res, next)=>{
    var {body : {email, password,affiliation}} = req;
    console.log(email, password, affiliation);
    var secret = await enrollAdmin.registerUser('admin',email, affiliation);
    var insertUser = await userQuery.insertUser(email, password, secret, affiliation);

    res.send(secret);
});

/* GET users listing. */
router.get('/', async (req, res, next)=>{
    var result = await userQuery.getUser(null);

    res.send(result);
});

router.post('/checkDupEmail', async (req, res)=>{
    var {body : {email}} = req;
    console.log(email);
    var result = await userQuery.checkDupEmail(email);
    console.log(result);

    res.send(result[0]);
});

module.exports = router;
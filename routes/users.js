var express = require('express');
var router = express.Router();
var userQuery = require('../query/user/user')();
var enrollAdmin = require('../fabricSDK/user/enrollAdmin');

router.post('/registerUser', async (req, res, next)=>{
    var {body : {email, password,affiliation}} = req;
    var secret = await enrollAdmin.registerUser('admin',email, affiliation);
    var params = [email, password, secret.secret, affiliation]
    var insertUser = await userQuery.insertUser(params);

    res.send(secret);
});

router.post('/loginProc', async(req, res)=>{
    var {body : {email, password}} = req;
    var params = [email, password];
    console.log(params);
    var result = await userQuery.loginProc(params);
    res.send(result[0]);
});

/* GET users listing. */
router.get('/', async (req, res, next)=>{
    var result = await userQuery.getUser(null);

    res.send(result);
});

router.post('/checkDupEmail', async (req, res)=>{
    var {body : {email}} = req;
    var result = await userQuery.checkDupEmail(email);

    res.send(result[0]);
});

module.exports = router;
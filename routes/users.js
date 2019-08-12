var express = require('express');
var router = express.Router();
var userQuery = require('../query/user/user')();

/* GET users listing. */
router.get('/', async (req, res, next)=>{
    var result = await userQuery.getUser(null);

    res.send(result);
});

router.get('/checkDupEmail', async (req, res)=>{
    var {body : {email, password}} = req;
    var result = await userQuery.checkDupEmail('ss');
    console.log(result);

    res.send(result[0]);
});

module.exports = router;
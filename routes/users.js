var express = require('express');
var router = express.Router();
var userQuery = require('../query/user/user')();

/* GET users listing. */
router.get('/', (req, res, next)=>{
    userQuery.getUser((err, result)=>{
        if(err) console.log(err);
        console.log(result);
    })
    res.send('respond with a resource');
});

module.exports = router;

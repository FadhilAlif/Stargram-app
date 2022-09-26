// const UsersController = require('./routes'); 
const router = require('express').Router(); 
 
router.post('/register', (req, res)=>{ 
    res.send("test")
}); 
 
module.exports = router;
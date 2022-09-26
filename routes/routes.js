const router = require('express').Router(); 
const usersRoutes = require('./usesrRoutes'); 
 
router.use('/Users', usersRoutes);  
 
router.use('/');
 
  
module.exports = router;
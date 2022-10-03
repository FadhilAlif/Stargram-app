const router = require('express').Router(); 
const usersRoutes = require('./usersRoutes'); 
const photoRoutes = require('./photosRoutes')
const socialmediaRoutes = require('./socialmediaRoutes')
const commentRoutes = require('./commentRoutes')


router.use('/users', usersRoutes)
router.use('/photos', photoRoutes)
router.use('/socialmedias', socialmediaRoutes)
router.use('/comments', commentRoutes)


module.exports = router;
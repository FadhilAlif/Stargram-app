const router = require('express').Router(); 
const usersRoutes = require('./usersRoutes'); 
const photoRoutes = require('./photosRoutes')
const socialmediaRoutes = require('./socialmediaRoutes')
const commentRoutes = require('./commentRoutes')

const authenticationMiddleware = require('./../middlewares/auth-middleware')
const errorMiddleware = require('./../middlewares/error-middleware')

router.use('/users', usersRoutes)
router.use(authenticationMiddleware)
router.use('/photos', photoRoutes)
router.use('/socialmedias', socialmediaRoutes)
router.use('/comments', commentRoutes)

router.use(errorMiddleware)

module.exports = router;
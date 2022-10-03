const UsersController = require('./../controller/usersController');
const router = require('express').Router();

router.post('/register', UsersController.signUp)
router.post('/login', UsersController.SignIn)
router.put('/:userId', )
router.delete('/:userId', )

module.exports = router;
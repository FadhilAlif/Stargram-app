const router = require('express').Router()
const photoController = require('./../controller/photoController')


router.post('/', )
router.get('/', photoController.getAllPhoto)
router.put('/:photoId', )
router.delete('/:photoId', )


module.exports = router
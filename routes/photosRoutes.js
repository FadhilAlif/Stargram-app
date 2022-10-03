const router = require('express').Router()
const photoController = require('./../controller/photoController')


router.post('/', photoController.addPhoto)
router.get('/', photoController.getAllPhoto)
router.put('/:photoId', )
router.delete('/:photoId', )


module.exports = router
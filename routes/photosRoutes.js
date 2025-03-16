const router = require('express').Router()
const photoController = require('./../controller/photoController')


// Route untuk menambahkan foto
router.post('/', photoController.addPhoto);

// Route untuk mendapatkan semua foto
router.get('/', photoController.getAllPhoto);

// Route untuk memperbarui foto
router.put('/:photoId', photoController.updatePhoto);

// Route untuk menghapus foto
router.delete('/:photoId', photoController.removePhoto);

module.exports = router
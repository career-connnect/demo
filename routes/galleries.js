const express = require('express');
const router = express.Router();
const GalleryModel = require('../models/galleries')
const { responseStructure } = require('../response/responseStructure')

router.get('/', async (req, res, next) => {
  const galleryResponse = await GalleryModel.find()
  if (galleryResponse) {
    return res.send(responseStructure(true, 'Gallery retrieved successfully', galleryResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

router.post('/', async (req, res, next) => {
  let gallery = req.body
  gallery = new GalleryModel(gallery)
  const saveResponse = await gallery.save()
  if (saveResponse) {
    return res.send(responseStructure(true, 'Gallery saved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

router.delete('/:id', async (req, res, next) => {
  const galleryId = req.params.id
  const deleteGalleryResponse = await GalleryModel.deleteOne({ _id: galleryId })
  if (deleteGalleryResponse) {
    return res.send(responseStructure(true, 'Gallery deleted successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

module.exports = router;

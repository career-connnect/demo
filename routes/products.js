const express = require('express');
const router = express.Router();
const validator = require('validator');
const ProductModel = require('../models/products');
const { responseStructure } = require('../response/responseStructure');

router.post('/', async (req, res, next) => {
  let product = req.body
  let error = ''
  if (validator.isEmpty(product.name)) {
    error = 'Product name is not valid'
  } else if (validator.isEmpty(product.description)) {
    error = 'Product description is not valid'
  } else if (!validator.isMongoId(product.category)) {
    error = 'Product category is not valid'
  } else if (!validator.isNumeric(product.price)) {
    error = 'Product price is not valid'
  }
  if (error) {
    return res.send(responseStructure(false, error)).end()
  }
  product.isActive = false
  product.isDeleted = true
  product = new ProductModel(product)
  const saveResponse = await product.save()
  if (saveResponse) {
    return res.send(responseStructure(true, 'Product added successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.delete('/:id', async (req, res, next) => {
  let productId = req.params.id
  const findResponse = await ProductModel.findOne({ _id: productId }, { _id: 0, isDeleted: 1, isActive: 1 })
  const saveResponse = await ProductModel.findOneAndUpdate({ _id: productId }, { $set: { isDeleted: !findResponse.isDeleted, isActive: !findResponse.isActive } })
  if (saveResponse) {
    return res.send(responseStructure(true, 'Product ' + (!findResponse.isDeleted ? 'inactivated' : 'activated') + ' successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.get('/single/:id', async (req, res, next) => {
  let productId = req.params.id
  const saveResponse = await ProductModel.findOne({ _id: productId }).populate('category', 'name')
  if (saveResponse) {
    return res.send(responseStructure(true, 'Product retrieved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.get('/:type/:role', async (req, res, next) => {
  let type = req.params.type
  let role = req.params.role
  let findObject = {}
  if (type !== 'all') {
    findObject = { category: type }
  }
  if (role !== 'ADMIN') {
    findObject = { ...findObject, isDeleted: false, isActive: true }
  }
  const saveResponse = await ProductModel.find(findObject).populate('category', 'name')
  if (saveResponse) {
    return res.send(responseStructure(true, 'Products retrieved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

module.exports = router;

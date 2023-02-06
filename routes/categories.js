const express = require('express');
const router = express.Router();
const validator = require('validator');
const CategoryModel = require('../models/categories')
const { responseStructure } = require('../response/responseStructure');

router.post('/', async (req, res, next) => {
  let category = req.body
  let error = ''
  if (validator.isEmpty(category.name)) {
    error = 'Category name is not valid'
  }
  if (error) {
    return res.send(responseStructure(false, error)).end()
  }
  category = new CategoryModel(category)
  const saveResponse = await category.save()
  if (saveResponse) {
    return res.send(responseStructure(true, 'Category added successfully', category)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.put('/:id', async (req, res, next) => {
  let categoryName = req.body.name
  let categoryId = req.params.id
  let error = ''
  if (validator.isEmpty(categoryName)) {
    error = 'Category name is not valid'
  }
  if (error) {
    return res.send(responseStructure(false, error)).end()
  }
  const saveResponse = await CategoryModel.findOneAndUpdate({ _id: categoryId }, { $set: { name: categoryName } })
  if (saveResponse) {
    return res.send(responseStructure(true, 'Category updated successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.delete('/:id', async (req, res, next) => {
  let categoryId = req.params.id
  const saveResponse = await CategoryModel.findOneAndUpdate({ _id: categoryId }, { $set: { isDeleted: true } })
  if (saveResponse) {
    return res.send(responseStructure(true, 'Category deleted successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.get('/', async (req, res, next) => {
  const saveResponse = await CategoryModel.find({ isDeleted: false })
  if (saveResponse) {
    return res.send(responseStructure(true, 'Categories retrieved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

module.exports = router;

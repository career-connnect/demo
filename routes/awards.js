const express = require('express');
const router = express.Router();
const AwardModel = require('../models/awards')
const { responseStructure } = require('../response/responseStructure')

router.get('/', async (req, res, next) => {
  const awardResponse = await AwardModel.find()
  if (awardResponse) {
    return res.send(responseStructure(true, 'Awards retrieved successfully', awardResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

router.post('/', async (req, res, next) => {
  let award = req.body
  award = new AwardModel(award)
  const saveResponse = await award.save()
  if (saveResponse) {
    return res.send(responseStructure(true, 'Award saved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

router.delete('/:id', async (req, res, next) => {
  const awardId = req.params.id
  const deleteAwardResponse = await AwardModel.deleteOne({ _id: awardId })
  if (deleteAwardResponse) {
    return res.send(responseStructure(true, 'Award deleted successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

module.exports = router;

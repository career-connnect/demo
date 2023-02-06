const express = require('express');
const router = express.Router();
const CouponModel = require('../models/coupons')
const { responseStructure } = require('../response/responseStructure')

router.post('/', async (req, res, next) => {
  let coupon = req.body
  coupon = new CouponModel(coupon)
  let saveResponse = ''
  try {
    saveResponse = await coupon.save()
  } catch (error) {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
  if (saveResponse) {
    return res.send(responseStructure(true, 'Coupon added successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

router.delete('/:id', async (req, res, next) => {
  const couponId = req.params.id
  const findResponse = await CouponModel.findOne({ _id: couponId }, { _id: 0, isDeleted: 1 })
  const saveResponse = await CouponModel.findOneAndUpdate({ _id: couponId }, { $set: { isDeleted: !findResponse.isDeleted } })
  if (saveResponse) {
    return res.send(responseStructure(true, 'Coupon ' + (!findResponse.isDeleted ? 'inactivated' : 'activated') + ' successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

router.get('/', async (req, res, next) => {
  const saveResponse = await CouponModel.find()
  if (saveResponse) {
    return res.send(responseStructure(true, 'Coupons retrieved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

module.exports = router;

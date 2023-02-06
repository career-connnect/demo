const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const UsersModel = require('../models/users')
const CouponsModel = require('../models/coupons')
const PaymentsModel = require('../models/payments')
const PaymentLogsModel = require('../models/paymentLogs')
const { responseStructure } = require('../response/responseStructure');
const { getCommissionPercentage } = require('./helpers');

router.post('/', async (req, res, next) => {
  try {
    const instance = new Razorpay({
      key_id: 'rzp_live_G0GpXVMtxIaJ0L',
      key_secret: 'ZiDEJNBAoNfbGZpysMbGTKuC'
    })

    let options = {
      amount: Number(req.body.amount * 100),
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex')
    }

    const validCoupon = await CouponsModel.findOne({ name: req.body.coupon, isDeleted: false })
    if (validCoupon) {
      let tempAmount = req.body.amount
      if (validCoupon.percentageDisc) {
        tempAmount = tempAmount - ((validCoupon.percentageDisc * tempAmount) / 100)
      } else if (validCoupon.amountDisc) {
        tempAmount = (tempAmount - validCoupon.amountDisc >= 0) ? tempAmount - validCoupon.amountDisc : 0
      }
      options.amount = Number(tempAmount * 100)
    }

    instance.orders.create(options, async (error, order) => {
      if (error) {
        console.log(error)
        return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime', error)).end()
      }
      const userData = await UsersModel.findOne({ _id: req.body.userId }, { _id: 0, reference: 1 })
      let paymentObject = {
        paymentId: order.id,
        name: req.body.name,
        description: req.body.description,
        productId: req.body.productId,
        userId: req.body.userId,
        price: options.amount / 100,
        coupon: req.body.coupon,
        reference: userData.reference
      }
      paymentObject = new PaymentsModel(paymentObject)
      await paymentObject.save()
      return res.send(responseStructure(true, 'Payment initiated successfully', order)).end()
    })
  } catch (error) {
    console.log(error)
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime', error)).end()
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto.createHmac('sha256', 'gT1M6C5LiKSNmM4hBeSvv03f').update(sign.toString()).digest('hex')
    if (razorpay_signature === expectedSign) {
      const updateResponse = await PaymentsModel.findOneAndUpdate({ paymentId: razorpay_order_id }, { $set: { status: 'Completed' } })
      const userUpdateResponse = await UsersModel.findOneAndUpdate({ _id: updateResponse.userId }, { $set: { isGreen: true } })
      const referenceUserResponse = {}
      if (userUpdateResponse.reference) {
        referenceUserResponse = await UsersModel.findOne({ _id: userUpdateResponse.reference }, { isGreen: 1 })
      }
      let greenUserCount = 0
      if (referenceUserResponse.isGreen) {
        greenUserCount = await UsersModel.countDocuments({ reference: userUpdateResponse.reference, isGreen: true })
      }
      const commPercentage = getCommissionPercentage(referenceUserResponse.isGreen, greenUserCount)
      const updateResponse1 = await PaymentsModel.findOneAndUpdate({ _id: updateResponse._id }, { $set: { commissionPercentage: commPercentage } })
      let logsObject = {
        description: updateResponse.description,
        userId: updateResponse.userId,
        price: updateResponse.price
      }
      logsObject = PaymentLogsModel(logsObject)
      await logsObject.save()
      return res.send(responseStructure(true, 'Payment verified successfully', order)).end()
    } else {
      return res.send(responseStructure(false, 'Invalid signature sent')).end()
    }
  } catch (error) {
    console.log(error)
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime', error)).end()
  }
})

router.get('/:id', async (req, res, next) => {
  const userId = req.params.id
  const saveResponse = await PaymentsModel.find({ userId: userId, status: 'Completed' })
  if (saveResponse) {
    return res.send(responseStructure(true, 'Payments retrieved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.get('/earnings/:id', async (req, res, next) => {
  const userId = req.params.id
  const saveResponse = await PaymentsModel.find({ reference: userId, status: 'Completed' }).populate('userId', 'firstName lastName')
  if (saveResponse) {
    return res.send(responseStructure(true, 'Earnings retrieved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.get('/logs/:role/:id', async (req, res, next) => {
  const role = req.params.role
  const userId = req.params.id
  let findObject = {}
  if (role !== 'ADMIN') {
    findObject = { userId: userId }
  }
  const saveResponse = await PaymentLogsModel.find(findObject, { _id: 0, description: 1, price: 1, updatedAt: 1 })
  if (saveResponse) {
    return res.send(responseStructure(true, 'Payment logs retrieved successfully', saveResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

module.exports = router;

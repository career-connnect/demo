const express = require('express');
const router = express.Router();
const validator = require('validator');
const UserModel = require('../models/users')
const { sendMail, FEAPPURL } = require('./helpers')
const { responseStructure } = require('../response/responseStructure');

router.get('/', async (req, res, next) => {
  const getResponse = await UserModel.find({ isDeleted: false, role: { $ne: 'ADMIN' } }, { password: 0, isDeleted: 0, reference: 0, createdAt: 0, updatedAt: 0 })
  if (getResponse) {
    return res.send(responseStructure(true, 'Users retrieved successfully', getResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

router.get('/:id', async (req, res, next) => {
  const userId = req.params.id
  const getResponse = await UserModel.find({ isDeleted: false, reference: userId }, { password: 0, isDeleted: 0, reference: 0, updatedAt: 0 })
  if (getResponse) {
    return res.send(responseStructure(true, 'Users retrieved successfully', getResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

router.post('/register', async (req, res, next) => {
  let user = req.body
  let error = ''
  if (!validator.isAlpha(user.firstName)) {
    error = 'Firstname is not valid'
  } else if (!validator.isAlpha(user.lastName)) {
    error = 'Lastname is not valid'
  } else if (!validator.isEmail(user.email)) {
    error = 'Email is not valid'
  } else if (!validator.isMobilePhone(user.mobileNumber, 'en-IN')) {
    error = 'Mobile number is not valid'
  } else if (!validator.isStrongPassword(user.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
    error = 'Password is not valid'
  }
  if (error) {
    return res.send(responseStructure(false, error)).end()
  }
  if (!user.reference) {
    const findResponse = await UserModel.findOne({ role: 'ADMIN' }, { _id: 1 })
    if (findResponse) {
      user.reference = findResponse._id
    }
  }
  user = new UserModel(user)
  const saveResponse = await user.save()
  if (saveResponse) {
    const emailHTML = '<div>Thank you registering with Career Connect</div><div>Please activate your account by clicking <a href=' + FEAPPURL + 'activate/' + user.email + '/' + saveResponse._id + '>here</a></div><div>Thank you</div>'
    await sendMail(user.email, 'Account Activation', emailHTML)
    let response = { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, mobileNumber: user.mobileNumber, role: user.role, reference: user.reference }
    return res.send(responseStructure(true, 'User register successfully', response)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.post('/login', async (req, res, next) => {
  let user = req.body
  let error = ''
  if (!validator.isEmail(user.email)) {
    error = 'Email is not valid'
  } else if (!validator.isStrongPassword(user.password, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
    error = 'Password is not valid'
  }
  if (error) {
    return res.send(responseStructure(false, error)).end()
  }
  const findResponse = await UserModel.findOne({ email: user.email, password: user.password }, { isDeleted: 0, password: 0 })
  if (findResponse) {
    return res.send(responseStructure(true, 'Logged in successfully', findResponse)).end()
  } else {
    return res.send(responseStructure(false, 'Username or Password is incorrect')).end()
  }
})

router.put('/role', async (req, res, next) => {
  const updateResponse = await UserModel.findOneAndUpdate({ _id: req.body.id }, { $set: { role: req.body.role } })
  if (updateResponse) {
    const getResponse = await UserModel.find({ isDeleted: false, role: { $ne: 'ADMIN' } }, { password: 0, isDeleted: 0, reference: 0, createdAt: 0, updatedAt: 0 })
    if (getResponse) {
      return res.send(responseStructure(true, 'User role successfully', getResponse)).end()
    } else {
      return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
    }
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
})

router.get('/activate/:email/:id', async (req, res, next) => {
  const emailAddress = req.params.email
  const userId = req.params.id
  const findResponse = await UserModel.findOneAndUpdate({ _id: userId, email: emailAddress }, { $set: { confirmed: true } })
  if (findResponse) {
    return res.send(responseStructure(true, 'Email activated successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Username or Password is incorrect')).end()
  }
})

router.get('/forgot/:email', async (req, res, next) => {
  const emailAddress = req.params.email
  let time = new Date()
  const findResponse = await UserModel.findOneAndUpdate({ email: emailAddress }, { $set: { forgotTime: time } })
  if (findResponse) {
    const emailHTML = '<div>Hello,</div><div>Please click on <a href=' + FEAPPURL + 'reset/' + time.getTime() + '/' + user.email + '>here</a> to reset the password</div><div>Ignore if you haven\'t generated this</div><div>Thank you</div>'
    await sendMail(user.email, 'Account Activation', emailHTML)
    return res.send(responseStructure(true, 'Link to reset password has been sent to email successfully')).end()
  } else {
    return res.send(responseStructure(false, 'Username or Password is incorrect')).end()
  }
})

module.exports = router;

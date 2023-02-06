const express = require('express');
const router = express.Router();
const UserModel = require('../models/users')
const { responseStructure } = require('../response/responseStructure')

router.get('/:id', async (req, res, next) => {
  const userId = req.params.id
  const saveResponse = await UserModel.find({ reference: userId, isDeleted: false })
  let allUsers = []
  for (let eachUser of saveResponse) {
    const findResponse = await UserModel.countDocuments({ reference: eachUser._id })
    allUsers.push({
      firstName: eachUser.firstName,
      lastName: eachUser.lastName,
      email: eachUser.email,
      mobileNumber: eachUser.mobileNumber,
      reference: eachUser.reference,
      role: eachUser.role,
      isGreen: eachUser.isGreen,
      directUser: findResponse
    })
  }
  if (saveResponse) {
    return res.send(responseStructure(true, 'Network retrieved successfully', allUsers)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

module.exports = router;

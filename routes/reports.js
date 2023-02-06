const express = require('express');
const router = express.Router();
const UserModel = require('../models/users')
const { responseStructure } = require('../response/responseStructure')

router.get('/users', async (req, res, next) => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth()
  const totalUserCount = await UserModel.countDocuments({ isDeleted: false })
  const currentMonthUserCount = await UserModel.countDocuments({ isDeleted: false, createdAt: { $gt: new Date(year, month, 1), $lt: new Date(year, month + 1, 0) } })
  const responseObject = { totalUserCount, currentMonthUserCount }
  if (responseObject) {
    return res.send(responseStructure(true, 'Users reports retrieved successfully', responseObject)).end()
  } else {
    return res.send(responseStructure(false, 'Something went wrong. Please try again after sometime')).end()
  }
});

module.exports = router;

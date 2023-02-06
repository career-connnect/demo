const express = require('express');
const router = express.Router();
const UserModel = require('../models/users')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('index');
});

module.exports = router;

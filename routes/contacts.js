const express = require('express');
const router = express.Router();
const { sendMail } = require('./helpers')
const { responseStructure } = require('../response/responseStructure')

router.post('/', async (req, res, next) => {
  let data = ''
  for (let i in req.body) {
    data += '<div>' + i + ' : ' + req.body[i] + '</div>'
  }
  // await sendMail('info@careerconnectedu.com', 'Franchise Inquiry', JSON.stringify(data))
  await sendMail('bhavik@yopmail.com', 'Contact Inquiry', data)
  return res.send(responseStructure(true, 'Thank you! Our representative will contact you')).end();
});

router.post('/franchise', async (req, res, next) => {
  let data = ''
  for (let i in req.body) {
    data += '<div>' + i + ' : ' + req.body[i] + '</div>'
  }
  // await sendMail('info@careerconnectedu.com', 'Franchise Inquiry', JSON.stringify(data))
  await sendMail('bhavik@yopmail.com', 'Franchise Inquiry', data)
  return res.send(responseStructure(true, 'Thank you! Our representative will contact you')).end();
});

module.exports = router;

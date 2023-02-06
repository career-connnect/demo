const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'career.connnect@gmail.com',
    pass: "hheeuoofcauiniyf",
  },
});

const FEAPPURL = 'http://careerconnectedu.com/'

const sendMail = async (toUser, subject, html) => {
  transporter.sendMail({
    from: '"Career Connect" <career.connnect@gmail.com>',
    to: toUser,
    subject: subject,
    html: html
  }).then(info => {
    console.log({ info });
    return true
  }).catch(console.error);
}

const getCommissionPercentage = (isGreen, greenUsers) => {
  if (isGreen) {
    if (greenUsers >= 50) {
      return 30
    } else if (greenUsers >= 25 && greenUsers < 35) {
      return 28
    } else if (greenUsers >= 15 && greenUsers < 25) {
      return 20
    } else if (greenUsers >= 5 && greenUsers < 15) {
      return 15
    } else if (greenUsers >= 1 && greenUsers < 5) {
      return 10
    } else {
      return 0
    }
  } else {
    return 0
  }
}

module.exports = { sendMail, FEAPPURL, getCommissionPercentage }
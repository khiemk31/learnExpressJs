const jwt = require('jsonwebtoken');
const {private_key} = require('../config');
const {isEmpty} = require('../utils/validate');
const {messagingServiceSid} = require('../config');

function generateOTP() {
  const OTP = Math.round(100000 + Math.random() * 899999);
  if (OTP.toString().length === 6) return OTP;
  return generateOTP();
}

function sendOTP(client, otp, phone) {
  console.log(typeof client.messages.create);
  return new Promise((resolve) => {
    if (!phone.includes('+84')) {
      phone = '+84' + phone.slice(1);
    }
    client.messages
      .create({
        body: `${otp} is your verification code.`,
        to: phone,
        messagingServiceSid,
      })
      .then((message) => resolve(message))
      .done();
  });
}

const encodeOTP = (otp, expire) => jwt.sign({otp, expire: expire.setSeconds(expire.getSeconds() + 120)}, private_key);

const decodeOTP = (token) => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, private_key, async (error, decode) => {
      if (error) {
        reject(`Verify JWT failed ${error}`);
      } else {
        if (isEmpty(decode)) {
          reject(`Verify JWT failed ${error}`);
        } else {
          resolve(decode);
        }
      }
    })
  );
};

module.exports = {generateOTP, sendOTP, encodeOTP, decodeOTP};

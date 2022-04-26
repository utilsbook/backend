'use strict';

const fs = require('fs');
const koa = require('koa');
const https = require('https');
const axios = require('axios');
const qs = require('qs');

const app = new koa();

async function sendSms(phone, code) {
  const data = {
    apikey: process.env['YUNPIAN_API_KEY'],
    mobile: phone,
    text: `【CodeIn】您的验证码是${code}，请勿泄漏。`,
  };

  // TEST
  return axios.post(
    'https://sms.yunpian.com/v2/sms/single_send.json',
    qs.stringify(data),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
}

function get6NumStr() {
  return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
}

const PHONE_REG = /[1][3578]\d{9}/;

// index page
app.use(function* (next) {
  const url = this.request.url;
  const phone = this.request.query.phone;

  if (url.startsWith('/sendSms') && PHONE_REG.test(phone)) {
    sendSms(phone, get6NumStr());
    this.body = `成功发送验证码: ${phone}`;
  } else {
    this.body = 'Built by jenkins automatically,View from: ' + url;
  }
});

// SSL options
const options = {
  key: fs.readFileSync('../ssl/icode.key'), //ssl文件路径
  cert: fs.readFileSync('../ssl/icode.pem'), //ssl文件路径
};

https.createServer(options, app.callback()).listen(996);

console.log('https server is running');

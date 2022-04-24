'use strict';

const koa = require('koa');
const https = require('https');
const fs = require('fs');

const app = new koa();

// index page
app.use(function* (next) {
  this.body = 'Backend: hello world from ' + this.request.url;
});

// SSL options
const options = {
  key: fs.readFileSync('../ssl/icode.key'), //ssl文件路径
  cert: fs.readFileSync('../ssl/icode.pem'), //ssl文件路径
};

https.createServer(options, app.callback()).listen(996);

console.log('https server is running');

// TEST

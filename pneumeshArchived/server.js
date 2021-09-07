var express = require('express');
var path = require('path');
var fs = require('fs');
var url = require('url')
var app = express();

app.use('/public', express.static('public'));
app.use('/node_modules', express.static('node_modules'));

app.all('*', function(req, res,next){
  let date = new Date();
  let dateStr = date.getMonth()+'/'+date.getDate()+' '+date.getHours()+':'+date.getMinutes();
  let log = dateStr + ' ' + req.path + ' ' + req.ip.substring(7) + '\n';
  fs.appendFile('log.txt', log, (e) => {});
  next();
});

app.get('/mkb', function(req, res){
  res.sendFile(path.join(__dirname, './index.html'), {}, (e)=>{});
});

app.listen(80);

var express = require('express');
var app = express();
var mysql = require('./db/mysql.js');
var session = require('express-session');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'/public')));
mysql.connect();

//get data from form

app.post('/login',function(req,res){
   console.log(req.body); 
   mysql.query('SELECT * FROM sample',function(err,result){
        if(err) console.log(err);
        else console.log(result);
   });
});

//open server
app.get('/',function(req,res){
    res.writeHead(200,{'Content-Type' : 'text/html'});
    res.end(data);
});
app.listen(80,function(){
    console.log('HackerTon server on');
});

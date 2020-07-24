var express = require('express');
var app = express();

var mysql = require('./db/mysql.js');
var session = require('express-session');
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var convert = require('xml-js');
var request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname,'/public')));
mysql.connect();
app.post('/in',function(req,res){

    console.log(req.body);
})
app.get('/getData',function(req,res){

    const xmlurl = 'http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=9tQYwzul4JBR2bdy3gCIJG8PBJFO45xaTR3OHxPiVWH4tJyGw2ypbc02yqWpWPqHzL2wYnIO820gNnJPUbgZUA%3D%3D&numOfRows=40&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.3&'
    request.get(xmlurl,function(err,res,body){
        if(err) console.log(err);
        else{
            if(res.statusCode == 200){
                var result = body;
                var xmlToJson = convert.xml2json(result,{compact:true,spaces:4});
                var stationCheck = -1;
                var parseJson = JSON.parse(xmlToJson);
                var value = parseJson.response.body.items;
                var data;
                
                for( var i in value.item){
                    if(value.item[i].stationName._text == '광진구') {
                        var data = parseJson.response.body.items.item[i];
                    } 
                }

                var dateext = data.dataTime._text;
                var station = data.stationName._text;
                var pm10Value = parseInt(data.pm10Value._text) ;
                var condition;
                if(pm10Value >= 76) condition = 3;
                else if(pm10Value >= 36 && pm10Value <= 75) condition = 2;
                else if(pm10Value >= 16 && pm10Value <= 35) condition = 1;
                else if(pm10Value >= 0 && pm10Value <= 15) condition = 0;
                else condition = -1;
                console.log(dateext,station,pm10Value,condition);

                mysql.query('SELECT dateext FROM air',function(err,result){
                    if(err) console.log(err);
                    else{
                        
                        var check = 0;
                        for( var i in result){
                            //console.log(result[i].dateext);
                            if(result[i].dateext == dateext) check++;
                        }


                        //console.log(check);
                     
                        if(check == 0){
                            mysql.query('INSERT INTO air (`dateext`,`station`,`value`,`condition`) VALUES (?,?,?,?)'
                                 ,[dateext,station,pm10Value,condition]
                                 , function(error,result){
                                     if(error){
                                        console.log(error);
                                     }
                                        else{
                                        }

                         });
                        }
                        
                    }
                });
        }
    }
})
});

//get data from form

app.post('/login',function(req,res){
   console.log(req.body); 
   mysql.query('SELECT * FROM sample',function(err,result){
        if(err) console.log(err);
        else console.log(result);
   });
});



//d ddddd
//open server
app.get('/',function(req,res){
    res.writeHead(200,{'Content-Type' : 'text/html'});
    res.end(data);
});
app.listen(80,function(){
    console.log('HackerTon server on');
});

/**
 * Created by chet on 15/5/29.
 */
var PORT = 5000;

var http = require('http');
var fs=require('fs');
var mine=require('./mine').types;
var func=require('./function');
var path=require('path');

var express = require('express'),
    app = express(),
	userIP = [],
	userName = [];
    server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	user_connectstr = "tcp://postgres:post@localhost:5432/projectdb",
	location_connectstr = "tcp://postgres:post@localhost:5432/projectdb",
	multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();
	
app.use('/', express.static(__dirname + '/assets/projectLLL'));
io.sockets.on('connection', function(socket) {
    //new user login
	var ip = socket.request.connection.remoteAddress;
	var index=userIP.indexOf(ip);
	if (index > -1) {
        socket.emit('nickExisted');
		console.log('existed!');
    } else {
	    console.log(ip + ' come to visit.');
        socket.userIndex = userIP.length;
        userIP.push(ip);
		userName.push('');
        io.sockets.emit('system', ip, userIP.length, 'login');
    };
		
    //user leaves
    socket.on('disconnect', function() {
		var nickName=userName[socket.userIndex];
		console.log(ip + ' left.');
        userIP.splice(socket.userIndex,1);
		userName.splice(socket.userIndex,1);
		var u;
		if(nickName=='' || nickName=='undefined')
			u = ip;
		else
			u = nickName;
        socket.broadcast.emit('system',u, userIP.length, 'logout');
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
		var nickName=userName[socket.userIndex];
		var u;
		if(nickName=='' || nickName=='undefined')
			u = ip;
		else
			u = nickName;
        socket.broadcast.emit('newMsg', u, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
		var nickName=userName[socket.userIndex];
		var u;
		if(nickName=='' || nickName=='undefined')
			u = ip;
		else
			u = nickName;
        socket.broadcast.emit('newImg', u, imgData, color);
    });
	console.log('connected!');
});


//响应一般查询动作
app.post('/queryPoi', function (req,res) {
   console.log('request');
   var func=require('./function');
   func.select(req,res);
});

app.post('/tosearcharound', multipartMiddleware, function (req, res) {
		var queryData = "";
		req.on('data', function (strChunk) {
			queryData += strChunk;
		});
		req.on('end', function () {
			console.log('数据接收完毕');
			//解析出客户端提交的信息中的参数，进行postgres查询
			var querystring = require("querystring");
			var params = querystring.parse(queryData);
			var pointx = params['pointx'],
				pointy = params['pointy'],
				searchRadius = params['searchRadius'];

			console.log(pointx+" "+pointy+" "+searchRadius);

			//利用客户端传过来的参数做查询，将查询结果返回到客户端
			//加载相应的模块，不同的数据库使用不同的模块
			var pg = require('pg');
			//构造连接数据库的连接字符串："tcp://用户名：密码@ip/相应点数据库名"
			var conString = "tcp://postgres:post@localhost:5432/projectdb";
			//构造一个数据库对象
			var client = new pg.Client(conString);

			//连接数据库，连接成功，执行回调函数
			client.connect(function (error, results) {
				if (error) {
					console.log("could not connect to postgres" + error.message);
					client.end();
					return;
				}
				console.log("Client connect is ok.\n");
			});
			var querystring = "select st_astext(the_geom) from poi_beijing where ST_DWithin(ST_Transform(the_geom,26986),ST_Transform(ST_Geometryfromtext('point('||" + pointx + "||' ' ||" + pointy + "||')',4326),26986)," + searchRadius + ")";
			console.log(querystring);
			//执行相应点sql语句
			client.query(querystring, function (error, results) {
				console.log("in callback function.\n");
				//console.log(results);
				//console.log(results.rowCount);
				if (error) {
					console.log("error");
					console.log('GetData Error:' + error.message);
					client.end();
					return;
				}
				if (results.rowCount > 0) {
					console.log(results);
					//callback(results)
					//指定为json格式输出
					res.writeHead(200, {
						"Content-Type": "application/json",
						"Access-Control-Allow-Origin": "*"
					});

					//先将results字符串内容转化成json格式，然后响应到浏览器上
					res.write(JSON.stringify(results, undefined, 3));
					res.end();
				}
			});
		});
	}
);
server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

app.post('/uploadFile', multipartMiddleware, function(req, res) {
  var temp_path = req.files.filename.path;
  var target_path = __dirname+'/uploaddata/' + req.files.filename.name;
  var mv = require('mv');
  mv(temp_path,target_path,function(err){
	  if(err) {
		  res.send('Failed to Upload file!');
          return console.log(err);		  
	  }
	  res.send('File uploaded to: ' + target_path + ' - ' + req.files.filename.size + ' bytes');
  });
});

app.post('/pointData-upload',multipartMiddleware, function(req, res) {
    var queryData = "";
	req.on('data',function(strChunk){
		queryData +=strChunk;
	});
	req.on('end',function(){
		var queryString = require('querystring');
		var params = queryString.parse(queryData);
		var longtitude = params['longtitude'],
		    latitude = params['latitude'],
			name = params['name'],
			address=params['address'];
		var pg = require('pg');
		var client = new pg.Client(location_connectstr);
		client.connect(function(err) {
            if(err) {
		 	    res.send('Failed to connect to the database!');
                return console.error('could not connect to postgres', err);
            }
    	    var querystr = 'INSERT INTO "poi_beijing1" ("pid","name","descriptio","x","y","address","city","province","country","geom") VALUES (\'8704\',\'' + name + '\',NULL,\'' + longtitude +'\',\'' +latitude+ '\',\'' + address+ '\',\'北京市\',\'北京\',\'中国\',\'0101000000B8E9CF7EA4135D40FAEC80EB8AFB4340\')';
			console.log(querystr);
            client.query(querystr, function(err, result) {
               if(err) {
          	        res.send('Failed to insert data into the database!');
                    return console.error('error running query', err);
                }
		    	res.send('success');
                console.log(result.rows.length);
                client.end();
            });
        });
	});
});


app.post('/login',multipartMiddleware,function(req,res){
	var queryData = "";
	req.on('data',function(strChunk){
		queryData +=strChunk;
	});
	req.on('end',function(){
		queryString = require('querystring');
    	var params = queryString.parse(queryData);
    	var email = params['email'],
    	    pwd = params['pwd'];
		var pg = require('pg');
    	var client = new pg.Client(user_connectstr);
    	client.connect(function(err) {
           if(err) {
			   //res.json({status:'failed'});
			   res.send('failed');
               return console.error('could not connect to postgres', err);
           }
    	var querystr = 'select * from "user" where email=\'' + email + '\' and password=md5(\'' +pwd +'\')';
    	console.log(querystr);
        client.query(querystr, function(err, result) {
            if(err) {
         	    //res.json({status:'failed'});
				res.send('failed');
                return console.error('error running query', err);
               }
			if(result.rows.length == 0){
				//res.json({status:'failed'});
				res.send('failed');
				return console.log('no result');
			}
			//res.json({status:'success',username:result.rows[0].username});
			var index=userIP.indexOf(req.ip);
			userName[index] = result.rows[0].username;
			res.send(userName[index]);
            console.log(result.rows.length);
			client.end();
           });
       });
	});
});

app.post('/register',multipartMiddleware,function(req,res){
	var queryData = "";
	req.on('data',function(strChunk){
		queryData +=strChunk;
	});
	req.on('end',function(){
		var queryString=require('querystring');
		var params = queryString.parse(queryData);
		var name = params['name'],
		    pwd = params['pwd'],
			email=params['email'],
			selfDisc=params['selfDisc'];
		var pg = require('pg');
		var client = new pg.Client(user_connectstr);
		client.connect(function(err) {
            if(err) {
		 	    res.send('failed');
                return console.error('could not connect to postgres', err);
            }
    	    var querystr = 'insert into "user"(email,username,password,selfdisc) values(\'' + email + '\',\'' + name + '\',md5(\'' + pwd + '\'),\'' + selfDisc + '\')';
    	    console.log(querystr);
            client.query(querystr, function(err, result) {
               if(err) {
          	        res.send('failed');
                    return console.error('error running query', err);
                }
		    	res.send('success');
                console.log(result.rows.length);
                client.end();
            });
        });
	});
});


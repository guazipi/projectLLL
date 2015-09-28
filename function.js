/**
 * Created by chet on 15/5/28.
 */

function select(request, response) {
    // 设置接收数据编码格式为 UTF-8
    request.setEncoding('utf-8');
    var postData = "";

    // 数据块接收中
    request.on('data', function (postDataChunk) {
        postData += postDataChunk;
        console.log('GOT DATA!');
    });

    // 数据接收完毕，执行回调函数
	
    request.on('end', function () {
        console.log('数据接收完毕');
		var querystring = require("querystring");
        var params = querystring.parse(postData);//GET & POST  ////解释表单数据部分

        console.log(params);
        //console.log(params["queryText"]);
        var searchText = params["queryText"];
        console.log(searchText);
        var finalText = "%" + searchText + "%";
        console.log(finalText);
        // console.log('select x, y, address from poi_beijing where name =' + finalText);

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

        //执行相应点sql语句
        //注释掉的一行是精确查询用的代码，就是直接把搜索的东西放到数据库里去查询
        client.query("select x, y, address,name from poi_beijing1 where name like $1", [finalText], function (error, results) {
            console.log("in callback function.\n");
            console.log(results.rowCount);
            if (error) {
                console.log("error");
                console.log('GetData Error:' + error.message);
                client.end();
                return;
            }
            if (results.rowCount > 0) {
                //先将results字符串内容转化成json格式，然后响应到浏览器上
				response.jsonp(JSON.stringify(results,undefined,3));
            }
        });
    });
};

exports.select = select;
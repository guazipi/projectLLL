/**
 * Created by chet on 15/6/2.
 */
//等待效果
function blur_and_wait() {
    var screen_value_on = 'screen_display_on';
    var screen = document.getElementById('screen');
    screen.className = screen_value_on;
}

function search_finished() {
    var screen_value_off = 'screen_display';
    var screen = document.getElementById('screen');
    screen.className = screen_value_off;
}

//搜索结果可视化
//输入搜索内容后，点击enter按钮执行搜索动作
$("#viewer-searchinput").each(function (index, el) {
    $(this).keydown(function () {
            if (event.keyCode == 13) {
                var search_text = $("#viewer-searchinput").val();
                if (search_text.length == 0) {
                    alert("请输入查询条件");
                }
                else {
                    blur_and_wait();
                    map_search(search_text);
                    $("#viewer-searchinput").val(null);

                }
            }
        }
    );
});
// 输入搜索内容后，点击搜索按钮执行搜索动作
$("#viewer-searchbutton").each(function (index, el) {
    $(this).click(function () {
        var search_text = $("#viewer-searchinput").val();
        if (search_text.length == 0) {
            alert("请输入查询条件");
        }
        else {
            blur_and_wait();
            map_search(search_text);
            $("#viewer-searchinput").val(null);

        }
    });
});
//
//将要搜索的内容通过ajax发送到服务器端
function map_search(search_text) {
    $.post('/queryPoi',
        {
            "queryText": search_text
        }, function (data, status) {

            if (status == 'success') {
                //console.log(data);

                //alert(data);
                //值得一提的是，此时从服务器端传输过来的data还不是真正的JSON格式，需要进一步的处理，
                //将其转化为真正的JSON对象
                var ret = jQuery.parseJSON(data);
                //alert(ret.rowCount);

                var finalData = ret.rows;
                //alert(finalData[0].x);

                //var result=data;
                //alert(result.rows[0].x);
                search_finished();
                display_side_bar();
                showMakerMap(finalData);
                showResults(finalData);
            } else {
                search_finished();
                alert(data + '\n' + status);
            }
        });
}

////将要搜索的内容通过ajax发送到服务器端
//function map_search(search_text) {
//
//    //var url = "http://localhost:3000";
//    var url = "queryPoi";
//    var data1 = {
//        "queryText": search_text
//    };
//
//    $.ajax({
//        type: "POST",
//        url: url,
//        data: data1,
//        dataType: "text",
//        async: true,
//        beforeSend: function (XMLHttpRequest) {
//        },
//        success: function (data) {
//            //alert(data);
//            console.log(data);
//
//            //值得一提的是，此时从服务器端传输过来的data还不是真正的JSON格式，需要进一步的处理，
//            //将其转化为真正的JSON对象
//            var ret = jQuery.parseJSON(data);
//            //alert(ret.rowCount);
//
//            var finalData = ret.rows;
//            //alert(finalData[0].x);
//
//            //var result=data;
//            //alert(result.rows[0].x);
//            display_side_bar();
//            search_finished();
//
//            showMakerMap(finalData);
//            showResults(finalData);
//        },
//        complete: function (XMLHttpRequest, textStatus) {
//
//            //display_side_bar();
//            //search_finished();
//        },
//        error: function () {
//            search_finished();
//            alert('抱歉，没有找到相关地点！');
//        }
//    });
//}

//将搜索结果显示到左边的区域内
function showResults(data) {
    var html = "";

    //each函数很管用，以后类似的重复进行的工作可用each函数代替
    $.each(data, function (commentIndex, comment) {
        var name = comment['name'];
        var address = comment['address'];

        html += "<div class='result_container'>";
        html += "	<ul>";
        html += "		<li><div class='result_logo'></div></li>";
        html += "		<li><p class='result_p'>" + name + "</p><p class='result_p'>" + "地址:" + address + "</p></li>";
        // html += "		<li><div class='result_div'>" + name + "<br>地址:" + address + "</div></li>";
        html += "	</ul>";
        html += "</div>";
    });
    document.getElementById("result_body_div").innerHTML = html;
}

//在搜索的结果除添加一个marker
function showMakerMap(data) {
    // 清空图层上的Marker
    g_marker_layer.clearMarkers();
    $.each(data, function (commentIndex, comment) {
        var xcoord = comment['x'];
        var ycoord = comment['y'];
        addMarker(xcoord, ycoord);
    });
}








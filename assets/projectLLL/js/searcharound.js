/**
 * Created by chet on 15/6/16.
 */
var searchAround = function (map, markerLayer) {
    var centerpoint = null;
    var startCoord = null;
    var centerPointSet = false;

    map.events.register('click', map, onMapClick);

    function onMapClick(event) {
        // 显示地图屏幕坐标
        if (!centerPointSet) {
            var lonlat = map.getLonLatFromPixel(event.xy);
            var size = new OpenLayers.Size(30, 30);
            var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
            var icon = new OpenLayers.Icon('../img/label.png', size, offset);

            centerpoint = new OpenLayers.Marker(lonlat, icon);
            markerLayer.addMarker(centerpoint);
            startCoord = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat).transform(
                new OpenLayers.Projection("EPSG:900913"),
                new OpenLayers.Projection("EPSG:4326"));

            document.getElementById('centerpoint').textContent = "(" + startCoord.x.toFixed(3) + "," + startCoord.y.toFixed(3) + ")";

            centerPointSet = true;
        }
    }

    //执行搜周边操作
    var actionsearcharound = document.getElementById('actionsearcharound');

    actionsearcharound.addEventListener('click', function (event) {
        if (centerpoint) {
            var searchRadius = $("#searchRadius").val();


            var url = "tosearcharound";
            var data = {
                "pointx": startCoord.x,
                "pointy": startCoord.y,
                "searchRadius": searchRadius
            };
            //发送ajax请求
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                dataType: "text",
                async: true,
                beforeSend: function (XMLHttpRequest) {
                },
                success: function (data) {
                    //客户端打印服务器回传的响应信息
                    //console.log(data);
                    //值得一提的是，此时从服务器端传输过来的data还不是真正的JSON格式，需要进一步的处理，
                    //将其转化为真正的JSON对象
                    var ret = jQuery.parseJSON(data);
                    //解析出真正使用的信息
                    var finalData = ret.rows;

                    showSearcharoundMaker(finalData);
                },
                complete: function (XMLHttpRequest, textStatus) {
                },
                error: function () {
                }
            })
        }
    });

    //在搜周边操作执行之后，对每个搜索结果添加一个marker
    function showSearcharoundMaker(data) {
        // 清空图层上的Marker
        //g_marker_layer.clearMarkers();
        $.each(data, function (commentIndex, comment) {
            var pointxy = comment['st_astext']
            var start = pointxy.indexOf("(");
            var middleIndex = pointxy.indexOf(" ");
            var xcoord = pointxy.slice(start + 1, middleIndex - 1);
            var endIndex = pointxy.indexOf(")", middleIndex);
            var ycoord = pointxy.slice(middleIndex + 1, endIndex - 1);
            addMarker(xcoord, ycoord);
        });
        //map.setCenter(
        //    startCoord.transform(
        //        new OpenLayers.Projection("EPSG:4326"),
        //        map.getProjectionObject()
        //    ), 8
        //);

        //确定视野范围
        var bounds = new OpenLayers.Bounds(startCoord.x - 0.02, startCoord.y - 0.008, startCoord.x + 0.02, startCoord.y + 0.01);
        g_map.zoomToExtent(
            bounds.transform(new OpenLayers.Projection("EPSG:4326"),
                g_map.getProjectionObject()));

        //设置中心点为空，当中心点为空时，点击查周边无法执行
        centerpoint = null;

    }

    //清空搜周边的结果
    var clearButton = document.getElementById('clearsearcharound');
    clearButton.addEventListener('click', function (event) {
        centerPointSet = false;
        markerLayer.clearMarkers();
        centerpoint.destroy();

    });
    //关闭搜周边提示框，并清空搜周边当结果
    var closeshortpath = document.getElementById('closesearcharound');
    closeshortpath.addEventListener('click', function (event) {
        //将注册的click事件删除
        map.events.unregister('click', map, onMapClick);

        var element = document.getElementById("searcharound_div");
        var value = 'toolbox_div_visible';
        deleteClass(element, value);

        centerPointSet = false;
        markerLayer.clearMarkers();
        centerpoint.destroy();
    });

}


/**
 * Created by chet on 15/6/14.
 */
var shortPath = function (map, markerLayer) {
    var startPoint = null;
    var destPoint = null;

    var startPointSet = false;
    var endPointSet = false;
    var startCoord;
    var destCoord

    var result;

    //var os = require('os');
    //var IPv4,hostName;
    //hostName=os.hostname();
    //for(var i=0;i<os.networkInterfaces().en0.length;i++){
    //    if(os.networkInterfaces().en0[i].family=='IPv4'){
    //        IPv4=os.networkInterfaces().en0[i].address;
    //    }
    //};


    var operateLayer = new OpenLayers.Layer.WMS("OpenLayers WMS",
        //geoserver所在服务器地址
        'http://'+document.location.hostname+':8080/geoserver/ProjectLLL/wms',
        {
            layers: 'ProjectLLL:beijing_line',
            format: "image/png",
            transparent: true,
            styles: '',
        },
        {
            isBaseLayer: false,
            singleTile: true,
            ratio: 1
        }
    );
    //map.addLayer(operateLayer);

    map.events.register('click', map, onMapClick);

    function onMapClick(event) {
        // 显示地图屏幕坐标
        if (!startPointSet) {
            var lonlat = map.getLonLatFromPixel(event.xy);
            startPoint = new OpenLayers.Marker(lonlat);
            markerLayer.addMarker(startPoint);
            startCoord = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat).transform(
                new OpenLayers.Projection("EPSG:900913"),
                new OpenLayers.Projection("EPSG:4326"));

            //alert(startCoord.x + "   " + startCoord.y);
            document.getElementById('startpoint').textContent = "(" + startCoord.x.toFixed(3) + "," + startCoord.y.toFixed(3) + ")";

            startPointSet = true;
        }
        else if (!endPointSet) {
            // Second click.
            var lonlat = map.getLonLatFromPixel(event.xy);
            destPoint = new OpenLayers.Marker(lonlat);
            markerLayer.addMarker(destPoint);
            destCoord = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat).transform(
                new OpenLayers.Projection("EPSG:900913"),
                new OpenLayers.Projection("EPSG:4326"));

            //alert(destCoord.x + "   " + destCoord.y);
            document.getElementById('endpoint').textContent = "(" + destCoord.x.toFixed(3) + "," + destCoord.y.toFixed(3) + ")";

            endPointSet = true;
            // Transform the coordinates from the map projection (EPSG:3857)
            // to the server projection (EPSG:4326).

            var viewparams = [
                'x1:' + startCoord.x, 'y1:' + startCoord.y,
                'x2:' + destCoord.x, 'y2:' + destCoord.y
                // 'x1:' + 12952117.2529, 'y1:' + 4836395.5717,
                // 'x2:' + 12945377.2585, 'y2:' + 4827305.7549
            ];
            viewparams = viewparams.join(';');
            //
            //function GetLocalIPAddress()
            //{
            //    var obj = null;
            //    var rslt = "";
            //    try
            //    {
            //        obj = new ActiveXObject("rcbdyctl.Setting");
            //        rslt = obj.GetIPAddress;
            //        obj = null;
            //    }
            //    catch(e)
            //    {
            //        alert("ErrInfoIS:"+e)
            //    }
            //    return rslt;
            //}
            result = new OpenLayers.Layer.WMS("navLayer",
                //'http://localhost:8080/geoserver/ProjectLLL/wms',
                'http://'+document.location.hostname+':8080/geoserver/ProjectLLL/wms',
                {
                    FORMAT: 'image/png',
                    transparent: true,
                    LAYERS: 'ProjectLLL:navigation',
                    viewparams: viewparams,
                    //styles:'pathatob'
                },
                {
                    isBaseLayer: false,
                    opacity: 1,
                }
            );
            map.addLayer(result);
        }
    }

    //清空路径规划结果
    var clearButton = document.getElementById('clearshortpath');
    clearButton.addEventListener('click', function (event) {
        // Reset the "start" and "destination" features.
        startPointSet = false;
        endPointSet = false;
        // Remove the result layer.
        markerLayer.removeMarker(startPoint);
        markerLayer.removeMarker(destPoint);
        startPoint.destroy();
        destPoint.destroy();
        map.removeLayer(result);
    });
    //关闭最短路径提示框，并清空路径规划结果
    var closeshortpath = document.getElementById('closeshortpath');
    closeshortpath.addEventListener('click', function (event) {
        //将注册的click事件删除
        map.events.unregister('click', map, onMapClick);

        var element = document.getElementById("shortpath_div");
        var value = 'toolbox_div_visible';
        deleteClass(element, value);

        // Reset the "start" and "destination" features.
        startPointSet = false;
        endPointSet = false;

        // Remove the result layer.
        markerLayer.removeMarker(startPoint);
        markerLayer.removeMarker(destPoint);
        startPoint.destroy();
        destPoint.destroy();
        map.removeLayer(result);


    });

}


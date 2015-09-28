var g_map = null;
var g_marker_layer = null;
var g_vector_layer = null;
var LTOverviewControl=null;
//弹出的popup，里面显示多边形的面积
function popupArea(feature) {
    var popup = new OpenLayers.Popup.FramedCloud("chicken",
        feature.geometry.getBounds().getCenterLonLat(),
        new OpenLayers.Size(350, 75),
        "<div style='font-size:.8em;-moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;user-select: none;'>您所画多边形的面积为: <br>" + feature.geometry.getArea() + "平方米</div>",
        //"<div style='font-size:.8em'>Feature: " + feature.id +"<br>Area: " + feature.geometry.getArea()+"</div>",
        null, true, onPopupClose);
    feature.popup = popup;
    g_map.addPopup(popup,true);
}
////弹出的popup，里面显示线的长度
function popupLength(feature) {
    var centerLonlat=new OpenLayers.LonLat(feature.geometry.getVertices(true)[0].x,feature.geometry.getVertices(true)[0].y);
    //alert(feature.geometry.getVertices(true)[0]);
    var popup = new OpenLayers.Popup.FramedCloud("chicken",
        centerLonlat,
        new OpenLayers.Size(350, 75),
        "<div style='font-size:.8em;-moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;user-select: none;'>您所画线的长度为: <br>" + feature.geometry.getLength() + "米</div>",
        //"<div style='font-size:.8em'>Feature: " + feature.id +"<br>Area: " + feature.geometry.getArea()+"</div>",
        null, true, onPopupClose);
    feature.popup = popup;
    g_map.addPopup(popup,true);
}

function onPopupClose(evt){
    this.destroy();
    //g_map.removePopup(feature.popup);
    //feature.popup.destroy();
    //feature.popup = null;
}

function addMarker(lon, lat) {
    //var lonlat = new OpenLayers.LonLat (116.34057617185, 39.932930765562);
    //创建坐标点对象
    var lonlat = new OpenLayers.LonLat(lon, lat);
    //投影变换(transform函数)
    var pos = lonlat.transform(
        new OpenLayers.Projection("EPSG:4326"), /*原始投影SRID*/
        g_map.getProjectionObject());
    /*目标投影SRID*/

    //定义icon对象，指定使用哪个图片显示Marker
    var icon = new OpenLayers.Icon('img/pin-32.png');
    //定义Marker
    //	1) pos：marker的位置
    //	2) icon：maker的图标
    var marker = new OpenLayers.Marker(pos, icon);
    //var marker = new OpenLayers.Marker(pos);
    marker.setOpacity(1.0);
    // 将maker添加到marker图层上
    g_marker_layer.addMarker(marker);
}
//对于制定的元素和一个样式类名称，添加或者删除该元素的这个样式类
function addClass(element, value) {
    if (!element.className) {
        element.className = value;
    } else {
        element.className += " ";
        element.className += value;
    }
}
function deleteClass(element, value) {
    var start = element.className.indexOf(value);
    if (start != -1) {
        // 如果包含，进行相应处理；
        //alert(element.className.slice(start));
        element.className = element.className.slice(0, start);
    }
}
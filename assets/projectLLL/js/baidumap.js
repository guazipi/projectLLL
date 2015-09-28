/**
 * Created by Lin on 2015/6/12.
 */
//document.getElementById('map-div').onload = baidu_init();
document.getElementById('panoramapickerLabel').onclick = changeintoPanorama;
function changeintoPanorama(){

    var panoramapickerItem_value = 'panoramapickerItem_afterclick';
    var panorama_label = document.getElementById('panoramapickerLabel');

    if (panorama_label.className.indexOf(panoramapickerItem_value) != -1) {
        deleteClass(panorama_label, panoramapickerItem_value);
    } else {
        addClass(panorama_label, panoramapickerItem_value);
    }

    var panorama_value = 'panorama-div-visible';
    var map_value = 'map-div-change';
    var map_value_baidu_show = 'map-div-baidu-show';
    var map_value_baidu_hide = 'map-div-baidu';
    var label_value_clicked = 'panorama-label-clicked';
    var label_value_normal = 'panorama-label';

    var panorama_div = document.getElementById('panorama');
    var map_div = document.getElementById('map-div');
    var map_div_baidu = document.getElementById('map-div_for_baidu');
    var cursor = document.getElementById('pointer_icon');
    var label = document.getElementById('panoramapickerLabel');

    view_bar_controller();
    notdisplay_side_bar();
    //show_side_bar();

    if (panorama_div.className.indexOf(panorama_value) != -1) {
        deleteClass(panorama_div, panorama_value);
    } else {
        addClass(panorama_div, panorama_value);
        panorama_map_display();
    }

    if (map_div.className.indexOf(map_value) != -1) {
        deleteClass(map_div, map_value);
        //初始化一个地图对象
        baidu_control.hide();
        //g_map.delete();
        panorama = null;
        baidu_map.disableScrollWheelZoom(true);
        //g_map = new OpenLayers.Map('map-div');
        //默认加载OpenStreetMap底图，可更换别的底图
        //g_map.addLayer(osmLayer);
        //设置地图的中心点和视野范围
        setView();
        map_div_baidu.className = map_value_baidu_hide;
        label.className = label_value_normal;
        cursor.style.cursor = 'pointer';
        cursor.onclick = show_side_bar;
    } else {
        map_div_baidu.className = map_value_baidu_show;
        addClass(map_div, map_value);
        label.className = label_value_clicked;
        cursor.style.cursor = 'not-allowed';
        cursor.onclick = function(){
            return false;
        }
    }
}
var testpoint = new BMap.Point(116.403338, 39.914105);
var baidu_control = new BMap.NavigationControl();

function baidu_init(){
    //普通地图展示
    baidu_map = new BMap.Map("map-div");
    g_map.centerAndZoom(testpoint, 16);
    g_map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    //map_center=map.getCenter();
    var marker=new BMap.Marker(testpoint);
    marker.enableDragging();
    g_map.addOverlay(marker);
    marker.addEventListener('dragend',function(e){
            panorama.setPosition(e.point); //拖动marker后，全景图位置也随着改变
            panorama.setPov({heading: -40, pitch: 6});}
    );
}

function panorama_map_display(){
    //init();
    baidu_map = new BMap.Map("map-div_for_baidu");
    baidu_map.centerAndZoom(testpoint,16);
    baidu_map.addControl(baidu_control);
    baidu_map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    //全景图展示
    panorama = new BMap.Panorama('panorama');
    panorama.setPosition(testpoint);
    //根据经纬度坐标展示全景图
    panorama.setPov({heading: -40, pitch: 6});
    panorama.addEventListener('position_changed', function(e){
        //全景图位置改变后，普通地图中心点也随之改变
        var pos = panorama.getPosition();
        baidu_map.setCenter(new BMap.Point(pos.lng, pos.lat));
        marker.setPosition(pos);
    });
    var marker=new BMap.Marker(testpoint);
    marker.enableDragging();
    baidu_map.addOverlay(marker);
    marker.addEventListener('dragend',function(e){
            panorama.setPosition(e.point); //拖动marker后，全景图位置也随着改变
            panorama.setPov({heading: -40, pitch: 6});}
    );
}
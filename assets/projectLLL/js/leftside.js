/**
 * Created by Lin on 2015/6/17.
 */

function view_bar_controller(){
    var value = 'viewer-bar-hidden';
    var viewer_bar = document.getElementById('viewer-bar');
    if (viewer_bar.className.indexOf(value) != -1) {
        deleteClass(viewer_bar, value);
    } else {
        addClass(viewer_bar, value);
    }
}

document.getElementById('close_panel').onclick = show_side_bar;
document.getElementById('pointer_icon').onclick = show_side_bar;

function notdisplay_side_bar(){

    var value_pointer_show = 'pointer_type';
    var pointer = document.getElementById('pointer_icon');
    pointer.className = value_pointer_show;

    var value_map_show = 'mapContainer_div';
    var map_container = document.getElementById('mapContainer');
    map_container.className = value_map_show;

    var value_panel_show ='result_container_div';
    var result_div = document.getElementById('result_panel');
    var panel_footer_label = document.getElementById('panel-footer-label');
    result_div.style.bottom = '0px';
    panel_footer_label.style.bottom = '0px';
    result_div.className = value_panel_show ;

}

function display_side_bar(){

    var value_pointer_show = 'pointer_type_show';
    var pointer = document.getElementById('pointer_icon');
        pointer.className = value_pointer_show;

    var value_map_show = 'mapContainer_div_reized';
    var map_container = document.getElementById('mapContainer');
        map_container.className = value_map_show;

    var value_panel_show ='result_container_div_show';
    var result_div = document.getElementById('result_panel');
    var panel_footer_label = document.getElementById('panel-footer-label');
    result_div.style.bottom = '0px';
    panel_footer_label.style.bottom = '0px';
        result_div.className = value_panel_show ;

}

function show_side_bar(){
    var value_map_show = 'mapContainer_div_reized';
    var value_map_hide = 'mapContainer_div';

    var map_container = document.getElementById('mapContainer');
    if (map_container.className.indexOf(value_map_show) != -1) {
        map_container.className = value_map_hide;
        //deleteClass(map_container, value_map);
    } else {
        map_container.className = value_map_show;
        //addClass(map_container, value_map);
    }

    var value_panel_show ='result_container_div_show';
    var value_panel_hide = 'result_container_div';
    var result_div = document.getElementById('result_panel');
    var panel_footer_label = document.getElementById('panel-footer-label');
    if (result_div.className.indexOf(value_panel_show) != -1) {
        //deleteClass(result_div, value_panel);
        result_div.className = value_panel_hide;
    } else {
        //addClass(result_div, value_panel);
        result_div.style.bottom = '0px';
        panel_footer_label.style.bottom = '0px';
        result_div.className = value_panel_show ;
    }

    pointer_controller();

}

function pointer_controller(){
    var value_pointer_show = 'pointer_type_show';
    var value_pointer_hide = 'pointer_type';
    var pointer = document.getElementById('pointer_icon');
    if (pointer.className.indexOf(value_pointer_show) != -1) {
        pointer.className = value_pointer_hide;
    } else {
        pointer.className = value_pointer_show;
    }
}

$("#catalog_div a").each(function () {
    // 设置每个a标签的onclick事件
    $(this).click(function () {
        //alert($(this).text());
        var search_text = $(this).text();
        map_search(search_text);
    });
});

//清除所有搜索结果和所有的marker
document.getElementById('clear_markers').onclick = clearMarkers;
function clearMarkers(){
    g_marker_layer.clearMarkers();
    var html="";
    html +="<div id='catalog_div'>";
    html +="<ul >";
    html +="<li class='result_catalog_item'><img src='img/hotel-32.png'/><a href='javascript:void(0)'>饭店</a></li>";
    html +="<li class='result_catalog_item'><img src='img/cinema-32.png'/><a href='javascript:void(0)'>电影院</a></li>";
    html +="<li class='result_catalog_item'><img src='img/bus_station-32.png'/><a href='javascript:void(0)'>公交站</a></li>";
    html +="<li class='result_catalog_item'><img src='img/rmb-32.png'/><a href='javascript:void(0)'>银行</a></li>";
    html +="<li class='result_catalog_item'><img src='img/shop-32.png'/><a href='javascript:void(0)'>商店</a></li>";
    html +="<li class='result_catalog_item'><img src='img/hospital-32.png'/><a href='javascript:void(0)'>医院</a></li>";
    html +="<li class='result_catalog_item'><img src='img/gasstation-32.png'/><a href='javascript:void(0)'>加油站</a></li>";
    html +="<li class='result_catalog_item'><img src='img/mail-32.png'/><a href='javascript:void(0)'>邮局</a></li>";
    html +="<li class='result_catalog_item'><img src='img/garden-32.png'/><a href='javascript:void(0)'>公园</a></li>";
    html +="<li class='result_catalog_item'><img src='img/Library-32.png'/><a href='javascript:void(0)'>图书馆</a></li>";
    html +="</ul>";
    html +="</div>";
    document.getElementById('result_body_div').innerHTML=html;

    $("#catalog_div a").each(function () {
        // 设置每个a标签的onclick事件
        $(this).click(function () {
            //alert($(this).text());
            var search_text = $(this).text();
            map_search(search_text);
        });
    });
}


/**
 * Created by chet on 15/6/2.
 */
function initMap() {
    var bounds = new OpenLayers.Bounds(116.145027, 39.756095, 116.703957, 40.027940);
    var options = {
        projection: "EPSG:900913",
        displayProjection: new OpenLayers.Projection('EPSG:4326'),
        center: new OpenLayers.LonLat(116.46760559087, 39.936089796286),
        maxExtent:bounds.transform(
            new OpenLayers.Projection("EPSG:4326"),
            new OpenLayers.Projection("EPSG:900913")
        )
    };
    //初始化一个地图对象
    g_map = new OpenLayers.Map('map-div',options);

    //默认加载OpenStreetMap底图，可更换别的底图
    g_map.addLayer(osmLayer);

    //设置地图的中心点和视野范围
    setView();

    // 创建Marker图层
    g_marker_layer = new OpenLayers.Layer.Markers("markers");
    g_map.addLayer(g_marker_layer);

    //最短路径分析的触发语句
    document.getElementById("shortpathHref").onclick=activeShortpath;
    function activeShortpath() {
        var shortpath = new shortPath(g_map, g_marker_layer);
        var element=document.getElementById("shortpath_div");
        var value = 'toolbox_div_visible';
        addClass(element, value);
    }

    //搜周边的触发语句
    document.getElementById("searcharoundHref").onclick=activeSearcharound;
    function activeSearcharound() {
        var searcharound = new searchAround(g_map, g_marker_layer);
        var element=document.getElementById("searcharound_div");
        var value = 'toolbox_div_visible';
        addClass(element, value);
    }
	
    //自定制的鹰眼图控件，一开始加载还挺好的，一换别的图层就出问题，用自带的控件也是如此，
    // 所以就先不加这个功能了，本来鹰眼功能就是一个可有可无的功能
    //g_map.addControl(new OpenLayers.Control.OverviewMap());
    /* LTOverviewControl=new OpenLayers.Control.LTOverviewMap();
     g_map.addControl(LTOverviewControl);*/
    //g_map.addControl(new OpenLayers.Control.OverviewMap());

    //创建一个空的矢量图层，便于添加或者删除各种feature
    var vector_layer = new OpenLayers.Layer.Vector("Simple Geometry");
    g_map.addLayer(vector_layer);

    //自定制的一个edit的工具栏
    var panel = new EditingPanel(vector_layer);
    g_map.addControl(panel);

    //openlayers自带的一个要素edit工具控件
    //g_map.addControl(new OpenLayers.Control.EditingToolbar(vector_layer));

    ////画三种类型的要素的方法，具体参考tinyExample/drawfeature.html，
    // 里面还是很详细的，也很有条理
    //var draw = new OpenLayers.Control.DrawFeature(
    //    vector_layer, OpenLayers.Handler.Path);
    //map.addControl(draw);
    //
    //draw.activate();

}
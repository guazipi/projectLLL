/**
 * Created by chet on 15/6/9.
 */
//整理后的各个底图的资源，直接添加到map中即可
var osmLayer = new OpenLayers.Layer.OSM();
var esriStreetLayer = new OpenLayers.Layer.ArcGIS93Rest("ESRI street world",
    "http://services.arcgisonline.com/arcgis/rest/services/ESRI_StreetMap_World_2D/MapServer/export",
    {
        layers: "show:0,1,2"
    });
var esriImageryLayer = new OpenLayers.Layer.ArcGIS93Rest("ESRI imagery world",
    "http://services.arcgisonline.com/arcgis/rest/services/ESRI_Imagery_World_2D/MapServer/export",
    {
        layers: "show:0,1,2"
    });
//g_map.addLayer(esriImageryLayer);
var tiandituImageLayer = new OpenLayers.Layer.WMTS({
    name: "影像图",
    url: "http://t0.tianditu.com/img_c/wmts",//影像图
    layer: "img",
    style: "default",
    matrixSet: "c",
    format: "tiles",
    isBaseLayer: true,
    mirrorUrl: ["http://t0.tianditu.com/img_c/wmts", "http://t1.tianditu.com/img_c/wmts", "http://t2.tianditu.com/img_c/wmts", "http://t3.tianditu.com/img_c/wmts",
        "http://t4.tianditu.com/img_c/wmts", "http://t5.tianditu.com/img_c/wmts", "http://t6.tianditu.com/img_c/wmts", "http://t7.tianditu.com/img_c/wmts"]
});
var tiandituImagenoteLayer = new OpenLayers.Layer.WMTS({
    name: "影像图注记",
    url: "http://t0.tianditu.com/cia_c/wmts",//中国影像图注记
    layer: "cia",
    style: "default",
    matrixSet: "c",
    format: "tiles",
    isBaseLayer: false
});
var tiandituvecLayer = new OpenLayers.Layer.WMTS({
    name: "中国底图(矢量)",
    url: "http://t0.tianditu.com/vec_c/wmts",//中国底图
    layer: "vec",
    style: "default",
    matrixSet: "c",
    format: "tiles",
    isBaseLayer: true
});
var tiandituvecnoteLayer = new OpenLayers.Layer.WMTS({
    name: "中国底图注记",
    url: "http://t0.tianditu.com/cva_c/wmts",//中国底图注记
    layer: "cva",
    style: "default",
    matrixSet: "c",
    format: "tiles",
    isBaseLayer: false
});

//点击底图面板中的各个底图选择项，所触发的事件
document.getElementById('openstreetMap').onclick = changeImageryandImg;
document.getElementById('esriImagery').onclick = changeImageryandImg;
document.getElementById('esriStreet').onclick = changeImageryandImg;
document.getElementById('tiandituvec').onclick = changeImageryandImg;
document.getElementById('tiandituImage').onclick = changeImageryandImg;
function changeImageryandImg() {
    //g_map.removeControl(LTOverviewControl);
    //将按钮中的图片换为所选底图的图片，实时的切换
    var selectimg = document.getElementById('selectimg');
    //alert(this.getElementsByTagName('img')[0].src);
    selectimg.src = this.getElementsByTagName('img')[0].src;

    var osm = g_map.getLayersByName('OpenStreetMap')[0];
    var esriImagery = g_map.getLayersByName('ESRI imagery world')[0];
    var esriStreet = g_map.getLayersByName('ESRI street world')[0];
    var imagery = g_map.getLayersByName("影像图")[0];
    var imagerynote = g_map.getLayersByName("影像图注记")[0];
    var vec = g_map.getLayersByName("中国底图(矢量)")[0];
    var vecnote = g_map.getLayersByName("中国底图注记")[0];

    //更换底图前，删除所有map中现存的底图
    if (osm) {
        g_map.removeLayer(osm);
    }
    if (esriImagery) {
        g_map.removeLayer(esriImagery);
    }
    if (esriStreet) {
        g_map.removeLayer(esriStreet);
    }
    if (imagery) {
        g_map.removeLayer(imagery);
    }
    if (imagerynote) {
        g_map.removeLayer(imagerynote);
    }
    if (vec) {
        g_map.removeLayer(vec);
    }
    if (vecnote) {
        g_map.removeLayer(vecnote);
    }

    //根据所点击的底图面板中的底图选择项的id来做相应的改变
    var thisLayer = this.id;
    if (thisLayer == 'openstreetMap') {
        g_map.addLayer(osmLayer);
        g_map.setBaseLayer(osmLayer);
        //setView();
        //g_map.addControl(LTOverviewControl);
    }

    if (thisLayer == 'esriImagery') {
        g_map.addLayers([esriImageryLayer, tiandituImagenoteLayer]);
        g_map.setBaseLayer(esriImageryLayer);
        setView();
        //g_map.addControl(LTOverviewControl);
    }
    if (thisLayer == 'esriStreet') {
        g_map.addLayer(esriStreetLayer);
        g_map.setBaseLayer(esriStreetLayer);
        setView();
        //g_map.addControl(LTOverviewControl);
    }
    if (thisLayer == 'tiandituImage') {
        g_map.addLayers([tiandituImageLayer, tiandituImagenoteLayer]);
        g_map.setBaseLayer(tiandituImageLayer);
        setView();
        //g_map.addControl(LTOverviewControl);
    }
    if (thisLayer == 'tiandituvec') {
        g_map.addLayers([tiandituvecLayer, tiandituvecnoteLayer]);
        g_map.setBaseLayer(tiandituvecLayer);
        setView();
        //g_map.addControl(LTOverviewControl);
    }

    //底图更换后，自动将底图面板隐藏，逻辑上需要这个
    var value = 'baseLayerPicker-dropDown-visible';
    var imageryProvider_div = document.getElementById('imageryProvider_div');
    deleteClass(imageryProvider_div, value);
}

//定义当前地图的视野范围，主要在更换底图后使用
function setView() {
    g_map.setCenter(
        new OpenLayers.LonLat(116.46760559087, 39.936089796286).transform(
            new OpenLayers.Projection("EPSG:4326"),
            g_map.getProjectionObject()
        ), 8
    );
    //确定视野范围
    var bounds = new OpenLayers.Bounds(116.145027, 39.756095, 116.703957, 40.027940);
    g_map.zoomToExtent(
        bounds.transform(new OpenLayers.Projection("EPSG:4326"),
            g_map.getProjectionObject()));
}
/**
 * Provide a custom editing panel for editing a multi-poly layer.
 * Not meant to be general purpose.
 */
function gethtml(lon, lat) {
    var html = "";
    html += "        <div id='labelpoint_div'>";
    html += "            <div>";
    html += "                <h4>添加感标记点标记</h4>";
    html += "            </div>";
    html += "            <div class='modal-body'>";
    html += "                <form class='form-horizontal'>";
    html += "                    <div class='form-group'>";
    html += "                       <label for='poiname' >标记点名称：</label>";
    html += "                       <input type='text' id='poiname'  placeholder='请输入标记点名称'/>";
    html += "                    </div>";
	
	html += "                    <div class='form-group'>";
    html += "                       <label for='poiaddress' >标记点街道：</label>";
    html += "                       <input type='text' id='poiaddress'  placeholder='请输入标记点街道名'/>";
    html += "                    </div>";
	
    html += "                    <div class='form-group'>";
    html += "                        <label >经&nbsp;&nbsp;&nbsp;&nbsp;度：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>";
    html += "                        <input type='text' id='poilon'  value=" + lon + " />";
    html += "                   </div>";

    html += "                   <div class='form-group'>";
    html += "                       <label >纬&nbsp;&nbsp;&nbsp;&nbsp;度：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>";
    html += "                       <input type='text' id='poilat'  value=" + lat + " />";
    html += "                   </div>";
    
    html += "                   </form>";
    html += "               </div>";
    html += "               <div id=submitDiv>";
    html += "                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    html +="                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type='button' class='btn btn-default' data-dismiss='modal' id='poicancel'>取消</button>";
    html += "                   &nbsp;&nbsp;&nbsp;&nbsp;<button type='button' class='btn btn-primary' id='poisubmit'>提交</button>";
    html += "               </div>";
    html += "          </div>";

    return html;
}

//自定义一个编辑的工具条
var EditingPanel = OpenLayers.Class(OpenLayers.Control.Panel, {

    initialize: function (layer) {

        OpenLayers.Control.Panel.prototype.initialize.apply(this, [{}]);

        var navigate = new OpenLayers.Control.Navigation({
            title: "Pan Map"
        });


        var drawFeaturePoint = new OpenLayers.Control.DrawFeature(
            layer, OpenLayers.Handler.Point, {
                title: "画点",
                handlerOptions: {multi: true},
                displayClass: 'olControlDrawFeaturePoint'
            }
        );


        var drawFeaturePath = new OpenLayers.Control.DrawFeature(
            layer, OpenLayers.Handler.Path, {
                title: "画线",
                handlerOptions: {multi: true},
                displayClass: 'olControlDrawFeaturePath'
            }
        );
        drawFeaturePath.featureAdded = popupLength;

        var drawFeaturePolygon = new OpenLayers.Control.DrawFeature(
            layer, OpenLayers.Handler.Polygon, {
                title: "画多边形",
                handlerOptions: {multi: true},
                displayClass: 'olControlDrawFeaturePolygon'
            }
        );
        drawFeaturePolygon.featureAdded = popupArea;


        var edit = new OpenLayers.Control.ModifyFeature(layer, {
            title: "修改要素"
        });

        var del = new DeleteFeature(layer, {title: "删除要素"});

        //var save = new OpenLayers.Control.Button({
        //    title: "保存更改",
        //    trigger: function () {
        //        if (edit.feature) {
        //            edit.selectControl.unselectAll();
        //        }
        //        // fails if no save strategy
        //        var start = OpenLayers.Array.filter(
        //            layer.strategies,
        //            function (s) {
        //                return s instanceof OpenLayers.Strategy.Save;
        //            }
        //        )[0];
        //        start.save();
        //    },
        //    displayClass: "olControlSaveFeatures"
        //});
        //var label = new OpenLayers.Control.Button({
        //    title: "标记",
        //    trigger: function () {
        //
        //        var clickObject = document.elementFromPoint(event.clientX, event.clientY);
        //        clickObject.className="olControlLabelFeaturesItemActive";
        //        alert(clickObject);
        //        var addlabel = labelpoint(g_map, g_marker_layer);
        //        alert("hskf");
        //    },
        //    displayClass: "olControlLabelFeatures"
        //});

        var label = new OpenLayers.Control.DrawFeature(
            layer, OpenLayers.Handler.Point, {
                title: "标记",
                handlerOptions: {multi: true},
                displayClass: 'olControlLabelFeatures'
            }
        );
        label.featureAdded = labelpoint;

        //弹出label中的上传信息对话框
        function labelpoint(feature) {
            layer.removeFeatures([feature]);
            var lonlat = feature.geometry.getBounds().getCenterLonLat();
            var clickpoint = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat).transform(
                new OpenLayers.Projection("EPSG:900913"),
                new OpenLayers.Projection("EPSG:4326"));
            var popupContentHTML=gethtml(clickpoint.x.toFixed(3),clickpoint.y.toFixed(3));
            var popup = new OpenLayers.Popup.FramedCloud("chicken",
                lonlat,
                new OpenLayers.Size(450, 350),
                popupContentHTML,
                //"<div style='font-size:.8em'>Feature: " + feature.id +"<br>Area: " + feature.geometry.getArea()+"</div>",
                null, true, onPopupClose);
            //feature.popup = popup;
            popup.autoSize=true;
            g_map.addPopup(popup);
            document.getElementById("poicancel").onclick=deletePopup;
            function deletePopup(){
                g_map.removePopup(popup);
                popup.destroy();
            }
			document.getElementById("poisubmit").onclick=submitPoi;
			function submitPoi(){
				$.post('/pointData-upload',
			    {
			    	longtitude:$('#poilon').val(),
			    	latitude:$('#poilat').val(),
			    	name:$('#poiname').val(),
			    	address:$('#poiaddress').val()
			    },function(data,status){
			    	if(data=='success' && status=='success'){
			    		document.getElementById('submitDiv').innerHTML='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;上传成功';
			    	}else{
			    		alert(data+'\n'+status);
			    	}
			    });
			}
        }

        this.defaultControl = navigate;
        this.addControls([navigate, drawFeaturePoint, drawFeaturePath, drawFeaturePolygon, edit, del, label]);

    },

    CLASS_NAME: "EditingPanel"
});

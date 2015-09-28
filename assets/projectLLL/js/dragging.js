/**
 * Created by Lin on 2015/6/17.
 */

$(function(){
    $('#chatWrapper').draggable({
        scroll:false,
        opacity:0.40
    });
    $('#shortpath_div').draggable({
        scroll:false,
        opacity:0.40
    });
    $('#searcharound_div').draggable({
        scroll:false,
        opacity:0.40
    });
    $("#result_panel" ).droppable({
        tolerance:'touch',
        drop: function(event) {
            //alert('hey');
//            event.target.style.borderWidth = '2px';
//            event.target.style.borderColor = "#00d6b2";
        }
    });
});

//
//var left_side_bar = $('result_panel');
//
//left_side_bar.ondragover = function(event) {
//    /*拖拽元素在目标元素头上移动的时候*/
//    event.preventDefault();
//    return true;
//};
//
//left_side_bar.ondragenter = function(event){
//    if ( event.target.className == "result_container_div_show" ) {
//        event.target.style.borderColor = "#00d6b2";
//    }
//};
//
//left_side_bar.ondragleave = function(event){
//    if ( event.target.className == "result_container_div_show" ) {
//        event.target.style.border = "";
//    }
//};


//var shortpath_div_panel = $('#shortpath_div');
//
//var evt = evt || window.event;
//



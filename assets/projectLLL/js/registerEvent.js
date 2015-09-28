/**
 * Created by chet on 15/6/9.
 */
//－－－－－－－－－－－－－－注册一些基本的事件－－－－－－－－－－－－－－－－－－－－－－－－－
//window加载完成后，初始化底图
//window.Onload = Init;
//当鼠标滑过搜索按钮时，搜索框出现
document.getElementById("viewer-searchbutton").onmouseover = visualInput;
function visualInput() {
    var searchinput = document.getElementById("viewer-searchinput");
    searchinput.style.width = '250px';
    searchinput.style.borderColor = '#ea4';
    searchinput.style.backgroundColor = 'rgba(15, 15, 15, 0.9)';
}
//当点击除搜索框和底图面板之外的区域时，隐藏搜索框和底图面板
window.document.onclick = hideInput;
function hideInput(event) {
    var clickObject = document.elementFromPoint(event.clientX, event.clientY);
    var imageryProvider=document.getElementById("imageryProvider_div");
    var selectBaselayerButton=document.getElementById("selectBaselayerButton");
    var selectimg=document.getElementById("selectimg");
    var searchinput = document.getElementById("viewer-searchinput");
    var searchbutton = document.getElementById("viewer-searchbutton");
	var loginUL = document.getElementById("lllllll");
	var loginA = document.getElementById("dropdownMenu4");
    if (clickObject != searchinput) {
        if (clickObject != searchbutton) {
            searchinput.style.width = '0px';
            searchinput.style.borderColor = '#edffff';
            searchinput.style.backgroundColor = 'rgba(40, 40, 40, 0.13)';
            searchinput.value = "";
        }
    }
    if(clickObject!=selectBaselayerButton){
        if(clickObject!=selectimg){
            if(clickObject!=imageryProvider){
                var value = 'baseLayerPicker-dropDown-visible';
                //alert(imageryProvider_div.className.indexOf(value));
                if (imageryProvider.className.indexOf(value) != -1) {
                    deleteClass(imageryProvider, value);
                }
            }
        }else{
            visualImageryProvider();
        }
    }
	//if(clickObject!=loginUL && clickObject!=loginA){
	//	loginUL.style.display="none";
	//}
}
//document.getElementById('selectBaselayerButton').onclick = visualImageryProvider;
function visualImageryProvider() {
    var value = 'baseLayerPicker-dropDown-visible';
    var imageryProvider_div = document.getElementById('imageryProvider_div');
    //alert(imageryProvider_div.className.indexOf(value));
    if (imageryProvider_div.className.indexOf(value) != -1) {
        deleteClass(imageryProvider_div, value);
    } else {
        addClass(imageryProvider_div, value);
    }
}

//点击home按钮后，页面打开主页
document.getElementById("homeButton").onclick = openHomepage;
function openHomepage() {
    var url = "http://localhost:5000/index.html";
    var link;
    if (document.getElementById("opennewpagelink") == null) {
        var _link = document.createElement("a");
        link = document.body.appendChild(_link);
        link.id = "opennewpagelink";
        //link.setAttribute("target", "_blank");
    } else {
        link = document.getElementById("opennewpagelink");
    }
    link.setAttribute("href", url);
    if (link.click) {
        link.click();
    } else {
        window.open(url);
    }
}






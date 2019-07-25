/**
 * Created by SYJ on 2017/07/07.
 */
var initPosition;
var initQuaternion;
var curve;
//js获取项目根路径，如： http://localhost:7070/mbserv
function getRootPath ()
{
    //获取当前网址，如： http://localhost:7070/mbserv/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： mbserv/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf (pathName);
    //获取主机地址，如： http://localhost:7070
    var localhostPaht = curWwwPath.substring (0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring (0, pathName.substr (1).indexOf ('/') + 1);
    //alert(localhostPaht+projectName);
    if (projectName == "/LSGlobe")
    {
	    return localhostPaht;
    }
    else
    {
	    return localhostPaht + projectName;
    }
}
//添加mark
function insertMarker(objEntity){
	/*objEntity含有一下成员markid,name,description,x,y,z,iconPath, iconSize, FontName, r, g, b,FontSize,markType,mediaUrl
	 * markid:标注id
	 * name:标注显示的文字
	 * des:描述，（description是原对象属性值，规避用des）
	 * x,y,z：坐标（可以移动，本版本暂不支持修改）
	 * iconPath:图标地址
	 * iconSize:图标大小（暂定固定大小，若设置需两个值）
	 * FontName:字体（）需和FontSize一同使用，'30px sans-serif'
	 * r/g/b:new Cesium.Color(red, green, blue, alpha)(目前默认白色，启用则可以有甚多)
	 * FontSize：如FontName
	 * markType:标注类型
	 * mediaUrl：媒体链接
	 */

	var iconUrl;
	if(location.href.indexOf("/mobile/")>-1){
        iconUrl="../"+objEntity.iconPath;
	}else{
        iconUrl=objEntity.iconPath;
	}
	var oNewMark=viewer.entities.add( {
        name : objEntity.name,
        position : new LSGlobe.Cartesian3(objEntity.x,objEntity.y,objEntity.z),
        /*point : { //点
         pixelSize : 5,
         color : LSGlobe.Color.RED,
         outlineColor : LSGlobe.Color.WHITE,
         outlineWidth : 2
         },
         id:"",*/
        label : { //文字标签
    		text : objEntity.name,
            font : (parseInt(objEntity.FontSize)*2.2)+"px "+objEntity.FontName,
            style : LSGlobe.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth :6,
            translucencyByDistance:new LSGlobe.NearFarScalar(1.5e3, 1.0, 4e3, 0.0),
            horizontalOrigin:LSGlobe.HorizontalOrigin.LEFT,
            //verticalOrigin : LSGlobe.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
            pixelOffset : new LSGlobe.Cartesian2( 15, -34 ),  //偏移量
            disableDepthTestDistance : 0,//优先级
            scale:0.5

        },
        billboard : { //图标
            image : iconUrl,
            width : 64,
            height : 64,
            disableDepthTestDistance : 0,
            scale:0.5,
			translucencyByDistance:new LSGlobe.NearFarScalar(1.5e2, 1.0, 1.5e5, 0.0),
			pixelOffset : new LSGlobe.Cartesian2( 0, -32 ),  //偏移量
        },
        id:objEntity.markid,
        des:objEntity.description,
        markerType:objEntity.markType,
        mediaUrl:objEntity.mediaUrl
    } );
    return oNewMark.id;
}
//删除mark
function deleteMark(markid){
	var allEntities = viewer.entities;
	if(markid=="All"){
		allEntities.removeAll();
	}else{
		allEntities.removeById(markid);
	}
}
function showMark(markid,type){
	var allEntities = viewer.entities;
	
	if(markid=="All"){
		allEntities.show=type;
	}else{
		allEntities.getById(markid).show=type;
	}
}
//更新mark
function updateMark(objEntity){
	/*objEntity含有一下成员markid,name,description,x,y,z,iconPath, iconSize, FontName, r, g, b,FontSize,markType,mediaUrl
	 * markid:标注id
	 * name:标注显示的文字
	 * des:描述，（description是原对象属性值，规避用des）
	 * x,y,z：坐标（可以移动，本版本暂不支持修改）
	 * iconPath:图标地址
	 * iconSize:图标大小（暂定固定大小，若设置需两个值）
	 * FontName:字体（）需和FontSize一同使用，'30px sans-serif'
	 * r/g/b:new Cesium.Color(red, green, blue, alpha)(目前默认白色，启用则可以有甚多)
	 * FontSize：如FontName
	 * markType:标注类型
	 * mediaUrl：媒体链接
	 */
	var SingleEntity=viewer.entities.getById(objEntity.markid);
	SingleEntity.name=objEntity.name;
	SingleEntity.markerType=objEntity.markType;
	SingleEntity.mediaUrl = objEntity.mediaUrl;
	SingleEntity.billboard =new LSGlobe.BillboardGraphics(
		{ //图标
        image : parent.basePath+objEntity.iconPath,
        width : 64,
        height : 64,
        disableDepthTestDistance :  1000000000,
        scale:0.5
        /* ,
        translucencyByDistance: new LSGlobe.NearFarScalar(1.5e4, 1.0, 1.5e7, 0.0) */
        });
	
	SingleEntity.label=new LSGlobe.LabelGraphics({
		text : objEntity.name,
		 font : (parseInt(objEntity.FontSize)*2)+"px "+objEntity.FontName,
         style : LSGlobe.LabelStyle.FILL_AND_OUTLINE,
         outlineWidth :6,
        /* translucencyByDistance: new LSGlobe.NearFarScalar(1.5e4, 1.0, 1.5e7, 0.0), */
        horizontalOrigin:LSGlobe.HorizontalOrigin.LEFT,
        //verticalOrigin : LSGlobe.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
        pixelOffset : new LSGlobe.Cartesian2( 15, -2 ),//偏移量
        disableDepthTestDistance :  1000000000,
        scale:0.5
    });
	SingleEntity.des=objEntity.description;
}
//插入十字图标
function InsertCross(oPos){
	var oNewMark=viewer.entities.add( {
        name : "十字图标",
        position : scene.pickPositionWorldCoordinates(oPos),
        billboard : { //图标
            image : 'images/icon-cross.png',
            width : 64,
            height : 64,
            disableDepthTestDistance : 1000000000,
            scale:0.5
            /* ,
            translucencyByDistance: new LSGlobe.NearFarScalar(1.5e4, 1.0, 1.5e7, 0.0) */
        },
        markerType:"cross"
    } );
    return oNewMark.id;
}
function DeleteCross(){
	var aEntities=viewer.entities._entities._array;
	for(var i=aEntities.length-1;i>=0;i--){
		if(aEntities[i].name=="十字图标"){
			viewer.entities.remove(viewer.entities.removeById(aEntities[i].id));
		}
	}
}
//定位飞行接口
function flyToViewPoint(position,direction,up){
	viewer.camera.flyTo({
	    destination :new LSGlobe.Cartesian3(position.x,position.y,position.z),
	    orientation : {
	        direction : new LSGlobe.Cartesian3(direction.x,direction.y,direction.z),
	        up : new LSGlobe.Cartesian3(up.x,up.y,up.z)
	    },
        duration:1
	});
}
//返回渲染图片
function getRenderer(){
	var ImgBase64=viewer.scene.canvas.toDataURL("image/jpeg", 0.5)
	return ImgBase64;
}
/**********双屏接口***********/
function flyToViewPoint(position,direction,up){
	viewer.camera.flyTo({
	    destination :new LSGlobe.Cartesian3(position.x,position.y,position.z),
	    orientation : {
	        direction : new LSGlobe.Cartesian3(direction.x,direction.y,direction.z),
	        up : new LSGlobe.Cartesian3(up.x,up.y,up.z)
	    }
	});
}
function jumpToViewPoint(position,direction,up){
	viewer.camera.flyTo({
	    destination :new LSGlobe.Cartesian3(position.x,position.y,position.z),
	    orientation : {
	        direction : new LSGlobe.Cartesian3(direction.x,direction.y,direction.z),
	        up : new LSGlobe.Cartesian3(up.x,up.y,up.z)
	    },
	    duration:0
	});
}
//版本信息
var oVersion = document.createElement('div');
oVersion.className="engine-version";
if(location.href.indexOf("InPage")<0){
    oVersion.innerHTML="版本库信息："+LSGlobe.VERSION;
    if(!!browser.versions.mobile){
    	document.querySelector("body").appendChild(oVersion);
    }else{
    	document.getElementById("switch-box").appendChild(oVersion);
    }
}



/*global Cesium*/
define([
    './src/Viewer',
    './src/Viewshed3D/Viewshed3D',
    'domReady!'
], function (
    Viewer,
    Viewshed3D
) {
    'use strict';

    var defined = Cesium.defined,
        CesiumTerrainProvider=Cesium.CesiumTerrainProvider
    ;

    //天地图
    var  tdtImgMap=new Cesium.WebMapTileServiceImageryProvider({
        url: "https://{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=b0ad70dc306d789204ddb4ec0b7c2b4d",
        layer: "tdtImgBasicLayer1",
        style: "default",
        subdomains:['t0','t1','t2','t3','t4','t5','t6','t7'],
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
        maximumLevel: 18,
        credit:'云 S（2017）065号',
        show: true
    });

    var terrainProvider=new CesiumTerrainProvider({
        //url:'https://maps.ynmap.cn/services/stk-terrain/tiles/4326/?key=njsc8ri2OHtkKtt0cnPVyoBx7Mr9QA7a%2Bc%2FF8OGpqG4%3D'
        url:'http://data.marsgis.cn/terrain'
    });


    //初始化viewer
    var viewer=new Viewer('container',{
        imageryProvider:tdtImgMap,
        terrainProvider:terrainProvider,
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        navigationInstructionsInitiallyVisible: false
    });

    viewer.scene.globe.depthTestAgainstTerrain = true;

    var tileset = new Cesium.Cesium3DTileset({
        url: 'http://data.marsgis.cn/3dtiles/qx-shequ/tileset.json'
    });

    viewer.scene.primitives.add(tileset);
    //viewer.zoomTo(tileset);

    //加载分析
    setTimeout(function(){
        viewer.camera.setView({
            destination:new Cesium.Cartesian3(-2760904.64933817,4702653.545599646,3296997.379249362)
        });
        AddAnalysis(1)
    },3000);




    var scene=viewer.scene;
    var canvas=viewer.canvas;
    var ellipsoid=viewer.scene.globe.ellipsoid;
    var camera=viewer.camera;

    var viewshed3daction = false;
    var viewshed3ding = false;
    var viewshed3d;
    var p_viewshed3d = undefined;

//分析数组
var aViewshed3d=[];
//默认分析
var aViewshed3d1=[];
function AddAnalysis(type) {

    if(type=="1"){
        var viewshed3d= new Viewshed3D(viewer);
        aViewshed3d1.push(viewshed3d);
        viewshed3d.viewerPosition = {
            x: -2760904.64933817,
            y: 4702653.545599646,
            z: 3296997.379249362
        };
        viewer.scene.primitives.add(viewshed3d);

        viewshed3d.setPoseByTargetPoint({
            x: -2760928.4290356967,
            y: 4702648.578513028,
            z: 3296948.446013283
        });
        var oAnalyPos = {
            "position": {x: -2760891.8061924158, y: 4702725.932935983, z: 3296960.3970659007},
            "up": {x: -0.6620328229522138, y: 0.3448428728064193, z: 0.6654291355272464},
            "direction": {x: -0.32949338250321675, y: -0.9313729148722554, z: 0.1548502642198178}
        };
        //flyToViewPoint(oAnalyPos.position,oAnalyPos.direction,oAnalyPos.up);
    }else{
        var viewshed3d= new Viewshed3D(viewer);
        aViewshed3d1.push(viewshed3d);
        viewshed3d.viewerPosition = {
            x: -2760904.64933817,
            y: 4702653.545599646,
            z: 3296997.379249362
        };
        viewer.scene.primitives.add(viewshed3d);

        viewshed3d.setPoseByTargetPoint({
            x: -2760928.4290356967,
            y: 4702648.578513028,
            z: 3296948.446013283
        });

        var viewshed3d1= new Viewshed3D(viewer);
        aViewshed3d1.push(viewshed3d1);
        viewshed3d.attachViewshed(viewshed3d1);
        viewshed3d1.viewerPosition = {
            x: -2760940.264064152,
            y: 4702642.485650311,
            z: 3296964.7421643375
        };

        viewer.scene.primitives.add(viewshed3d1);

        viewshed3d1.setPoseByTargetPoint({
            x: -2760899.085916036,
            y: 4702637.411134548,
            z: 3296988.583795315
        });

        var oAnalyPos = {
            "position": {x: -2760891.8061924158, y: 4702725.932935983, z: 3296960.3970659007},
            "up": {x: -0.6620328229522138, y: 0.3448428728064193, z: 0.6654291355272464},
            "direction": {x: -0.32949338250321675, y: -0.9313729148722554, z: 0.1548502642198178}
        };
        //flyToViewPoint(oAnalyPos.position,oAnalyPos.direction,oAnalyPos.up);
    }
}

});
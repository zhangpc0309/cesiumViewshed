/*global Cesium*/
define([
    'Cesium/Core/CesiumTerrainProvider',
    'Cesium/Scene/WebMapTileServiceImageryProvider',
    'Cesium/Scene/Cesium3DTileset',
    'Cesium/Core/defined',
    'Cesium/Core/Cartesian3',
    'Cesium/Core/ScreenSpaceEventHandler',
    'Cesium/Core/ScreenSpaceEventType',
    'Cesium/Widgets/Viewer/Viewer',
    'Cesium/LSSource/Viewshed3D',
    'domReady!'
], function(
    CesiumTerrainProvider,
    WebMapTileServiceImageryProvider,
    Cesium3DTileset,
    defined,
    Cartesian3,
    ScreenSpaceEventHandler,
    ScreenSpaceEventType,
    Viewer,
    Viewshed3D
) {
    'use strict';

    //天地图
    var tdtImgMap = new WebMapTileServiceImageryProvider({
        url : "https://{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=b0ad70dc306d789204ddb4ec0b7c2b4d",
        layer : "tdtImgBasicLayer1",
        style : "default",
        subdomains : ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
        format : "image/jpeg",
        tileMatrixSetID : "GoogleMapsCompatible",
        maximumLevel : 18,
        credit : '云 S（2017）065号',
        show : true
    });

    var terrainProvider = new CesiumTerrainProvider({
        //url:'https://maps.ynmap.cn/services/stk-terrain/tiles/4326/?key=njsc8ri2OHtkKtt0cnPVyoBx7Mr9QA7a%2Bc%2FF8OGpqG4%3D'
        url : 'http://data.marsgis.cn/terrain'
    });

    //初始化viewer
    var viewer = new Viewer('container', {
        imageryProvider : tdtImgMap,
        //terrainProvider : terrainProvider,
        animation : false,
        baseLayerPicker : false,
        fullscreenButton : false,
        vrButton : false,
        geocoder : false,
        homeButton : false,
        infoBox : false,
        sceneModePicker : false,
        selectionIndicator : false,
        timeline : false,
        navigationHelpButton : false,
        navigationInstructionsInitiallyVisible : false
    });

    //viewer.scene.globe.depthTestAgainstTerrain = true;

    var tileset = new Cesium3DTileset({
        url : 'http://data.marsgis.cn/3dtiles/qx-shequ/tileset.json'
    });

    viewer.scene.primitives.add(tileset);
    viewer.zoomTo(tileset);

    //加载分析
    setTimeout(function() {
        viewer.camera.setView({
            destination : new Cartesian3(-2762104.0476684,4886047.755456751,3019628.591175519)
        });
        AddAnalysis(1)
    }, 3000);

    var scene = viewer.scene;
    var canvas = viewer.canvas;
    var ellipsoid = viewer.scene.globe.ellipsoid;
    var camera = viewer.camera;

    var viewshed3daction = true;
    var viewshed3ding = false;
    var viewshed3d;
    var p_viewshed3d = undefined;

    //分析数组
    var aViewshed3d = [];
    //默认分析
    var aViewshed3d1 = [];

    function AddAnalysis(type) {
        var viewshed3d = new Viewshed3D(viewer);
        viewshed3d._valid=true;

        aViewshed3d1.push(viewshed3d);
        viewshed3d.viewerPosition = {
            x: -2762066.318489765,
            y: 4886096.354077554,
            z: 3019590.343410957
        };
        viewer.scene.primitives.add(viewshed3d);

        viewshed3d.setPoseByTargetPoint({
            x: -2762104.0476684,
            y: 4886047.755456751,
            z: 3019628.591175519
        });
    }

    var handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    //鼠标左击
    handler.setInputAction(function (movement) {
        var cartesian = viewer.scene.pickPosition(movement.position);
        console.log(cartesian);
        // 可视域分析
        if(viewshed3daction){
            var cartesian = viewer.scene.pickPosition(movement.position);
            if(cartesian != undefined && !viewshed3ding){
                cartesian.z+=0.08;
                viewshed3d.viewerPosition = cartesian;
                viewer.scene.primitives.add(viewshed3d);

            }else{

                viewshed3d.setPoseByTargetPoint(cartesian);
                viewshed3daction=false;
            }
            viewshed3ding = true;
        }



    }, ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction(function (movement) {
        if(viewshed3daction&&viewshed3ding){
            var cartesian = viewer.scene.pickPosition(movement.endPosition);
            viewshed3d.setPoseByTargetPoint(cartesian);
        }
    }, ScreenSpaceEventType.MOUSE_MOVE);

});

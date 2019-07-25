/*global require*/
/*eslint-disable strict*/

require.config({
    baseUrl : '.',
    paths: {
        domReady : '../../ThirdParty/requirejs-2.1.20/domReady',
        Cesium : '../../Source'
    }
});

require( [
    './myViewer'
], function() {

});

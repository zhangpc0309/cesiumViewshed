/*global require*/
/*eslint-disable strict*/

require.config({
    baseUrl : '.',
    paths: {
        domReady : './lib/requirejs-2.1.20/domReady'
    }
});

require( [
    './myViewer'
], function() {

});
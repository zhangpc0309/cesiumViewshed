define([

], function (

) {
    'use strict';

    function ViewshedLineVS() {
        return "attribute vec3 position;\nuniform mat4 u_modelViewMatrix;\nvoid main()\n{\n    gl_Position = czm_projection* u_modelViewMatrix* vec4(position.xyz,1.0);\n}";
    }

    return ViewshedLineVS;
});
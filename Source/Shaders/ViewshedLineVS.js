//This file is automatically rebuilt by the Cesium build process.
define(function() {
    'use strict';
    return "attribute vec3 position;\n\
uniform mat4 u_modelViewMatrix;\n\
void main()\n\
{\n\
    gl_Position = czm_projection* u_modelViewMatrix* vec4(position.xyz,1.0);\n\
}";
});
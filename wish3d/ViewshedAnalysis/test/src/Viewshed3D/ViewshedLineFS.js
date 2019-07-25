define([

], function (

) {
    'use strict';

    function ViewshedLineFS() {
        return "uniform vec4 u_bgColor;\nvoid main()\n{\n    gl_FragColor = u_bgColor;\n}\n";
    }

    return ViewshedLineFS;
});
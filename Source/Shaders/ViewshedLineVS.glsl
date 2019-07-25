attribute vec3 position;
uniform mat4 u_modelViewMatrix;
void main()
{
    gl_Position = czm_projection* u_modelViewMatrix* vec4(position.xyz,1.0);
}
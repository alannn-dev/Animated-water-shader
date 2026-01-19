uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

void main()
{
    // gl_FragColor = vec4(uDepthColor.r,uDepthColor.g, uDepthColor.b, 1.0);
    gl_FragColor = vec4(uDepthColor, 1.0);

    // gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);

    #include <colorspace_fragment>
}
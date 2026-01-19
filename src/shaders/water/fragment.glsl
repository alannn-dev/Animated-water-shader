uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying float vElevation;

void main()
{
    // Mixing color of uDepthColor and uSurfaceColor according to vElevation.
    vec3 color = mix(uDepthColor, uSurfaceColor, vElevation);

    // gl_FragColor = vec4(uDepthColor.r,uDepthColor.g, uDepthColor.b, 1.0);
    gl_FragColor = vec4(color, 1.0);

    // gl_FragColor = vec4(0.5, 0.8, 1.0, 1.0);

    #include <colorspace_fragment>
}
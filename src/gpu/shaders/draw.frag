#version 300 es
precision lowp float;

uniform vec4 u_color;
out vec4 outColor;

float intensivity = 3.0;

void main() {
    float alpha = (0.5 - length(gl_PointCoord - 0.5)) * intensivity;
    outColor = vec4(u_color.rgb, alpha);
}
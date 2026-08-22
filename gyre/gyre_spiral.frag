// Gyre Spiral Fragment
precision mediump float;
uniform float u_time;
uniform float u_spiral;
varying vec2 v_uv;

void main() {
  float a = atan(v_uv.y - 0.5, v_uv.x - 0.5);
  float r = length(v_uv - 0.5);
  float wave = sin(a * 3.0 + r * 12.0 - u_time * 1.8 + u_spiral * 4.0);
  vec3 col = vec3(0.4 + 0.4 * wave, 0.3 + 0.3 * sin(u_time), 0.5 + 0.3 * cos(a));
  gl_FragColor = vec4(col, 0.7 + 0.2 * abs(wave));
}

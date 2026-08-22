// Orrery Visualizer Fragment
precision mediump float;
uniform float u_time;
uniform vec3 u_spheres; // meridian gyre fracture
varying vec2 v_uv;

void main() {
  float pulse = 0.5 + 0.5 * sin(u_time * 1.5);
  vec3 col = vec3(
    u_spheres.x * (0.55 + 0.45 * sin(v_uv.x * 8.0 + u_time)),
    u_spheres.y * (0.55 + 0.45 * cos(v_uv.y * 6.5 - u_time)),
    u_spheres.z * (0.45 + 0.55 * pulse)
  );
  gl_FragColor = vec4(col, 0.73);
}

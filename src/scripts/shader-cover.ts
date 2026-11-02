/**
 * Couvertures animées du journal : port en WebGL nu du shader « aurora veil » (deux voiles de couleur qui ondulent
 * + grain), couleurs lues dans --shader-a / --shader-b de l'élément. Pause hors écran, statique si
 * prefers-reduced-motion, dégradé CSS en repli si WebGL manque.
 */
const VERT = `attribute vec2 a_position; void main(){ gl_Position = vec4(a_position, 0.0, 1.0); }`;
const FRAG = `
precision mediump float;
uniform vec2 u_resolution; uniform float u_time; uniform vec3 u_a; uniform vec3 u_b; uniform float u_grain;
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x), u.y); }
mat2 rot(float a){ float s = sin(a); float c = cos(a); return mat2(c, -s, s, c); }
float fbm(vec2 p){ float v = 0.0; float amp = 0.5; for (int i = 0; i < 4; i++) { v += amp * noise(p); p = rot(0.72) * p * 2.03 + 4.17; amp *= 0.5; } return v; }
void main(){
  vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution) / max(min(u_resolution.x, u_resolution.y), 1.0);
  float t = u_time;
  vec2 q = p;
  q.x += sin(q.y * 2.0 + t * 0.18) * 0.22;
  q.y += cos(q.x * 1.7 - t * 0.14) * 0.16;
  float veilA = smoothstep(0.72, 0.04, abs(q.y + sin(q.x * 1.8 + t * 0.24) * 0.32));
  float veilB = smoothstep(0.62, 0.02, abs(q.y * 0.85 - cos(q.x * 2.4 - t * 0.2) * 0.24));
  float grain = fbm(q * 2.5 + t * 0.04);
  vec3 base = mix(u_a, u_b, 0.5) * 0.35;
  vec3 color = base + u_a * veilA * 0.9 + u_b * veilB * 0.75;
  color += (grain - 0.5) * u_grain;
  gl_FragColor = vec4(pow(max(color, vec3(0.0)), vec3(0.92)), 1.0);
}`;

const hex = (value: string): [number, number, number] => {
  const m = value.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return [0.84, 0.95, 0.05];
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll<HTMLElement>('[data-shader-cover]').forEach((root) => {
  const canvas = root.querySelector('canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
  if (!gl) return;
  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const pos = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(pos);
  gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

  const styles = getComputedStyle(root);
  const a = hex(styles.getPropertyValue('--shader-a'));
  const b = hex(styles.getPropertyValue('--shader-b'));
  const speed = parseFloat(styles.getPropertyValue('--shader-speed')) || 0.35;
  const grain = parseFloat(styles.getPropertyValue('--shader-grain')) || 0.05;
  gl.uniform3f(gl.getUniformLocation(program, 'u_a'), a[0], a[1], a[2]);
  gl.uniform3f(gl.getUniformLocation(program, 'u_b'), b[0], b[1], b[2]);
  gl.uniform1f(gl.getUniformLocation(program, 'u_grain'), grain);
  const uRes = gl.getUniformLocation(program, 'u_resolution');
  const uTime = gl.getUniformLocation(program, 'u_time');

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
    const w = Math.max(1, Math.floor(root.clientWidth * ratio * 0.5));
    const h = Math.max(1, Math.floor(root.clientHeight * ratio * 0.5));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };
  // Décalage propre à chaque couverture pour que deux cartes voisines ne soient pas en phase.
  const offset = (Number(root.className.match(/shader-(\d+)-a/)?.[1]) || 1) * 7.3;
  const render = (now: number) => {
    resize();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, (reduceMotion ? 18 : now * 0.001 * speed) + offset);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    canvas.dataset.ready = '';
  };

  let frame = 0;
  let visible = false;
  const tick = (now: number) => {
    if (!visible) {
      frame = 0;
      return;
    }
    render(now);
    frame = requestAnimationFrame(tick);
  };
  new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (visible) {
        render(performance.now());
        if (!reduceMotion && !frame) frame = requestAnimationFrame(tick);
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { threshold: 0.01 },
  ).observe(root);
  new ResizeObserver(() => render(performance.now())).observe(root);
});

export {};

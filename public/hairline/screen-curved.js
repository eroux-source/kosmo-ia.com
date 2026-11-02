/**
 * Screen-curved: an LED screen bent into an arc on a floor plate, built the way real ones are: a
 * housing whose face is split into cabinets by dim seams. The pointer is a
 * field: the cabinets near it slide forward out of the face along their own
 * normal, each on its spring, the nearest the furthest; the one under the
 * pointer takes the bright edge. At rest two cabinets are already part way out.
 * The slider is the reach, in viewBox units.
 *
 * The pattern: Terrain's field, on a wall instead of the ground. The hit test is
 * each cabinet's face centre in the rest pose, which never moves. Cabinets are
 * painted after the housing, back to front by depth, and moved when it changes.
 */
const {
  Cam, circ, clamp, fit, hull, open, poly, prism, proj, rings, rrect, seg,
  spring, stepS, facing, mk, pointer, put, register, disposer, solid,
} = HL;

const SHAPE = "curved";
const CW = 14, CH = 12, D = 4, PUSH = 16, ROWS = 3, SHOW = 0.5;
const R_EDGE = 0.4;                                  // corners: rounded by about a pixel on screen, as sharp as the site wants
const V = [Math.SQRT1_2, Math.SQRT1_2];            // toward the viewer, on the ground
const dot2 = (a, b) => a[0] * b[0] + a[1] * b[1];
const REST = [[3, 1, 0.9], [5, 2, 0.45]];                              // [column, row, share of PUSH]

/** Columns of cabinets (a point on the face, its outward normal) and the structure they sit on. */
function layout() {
  const cols = [];
  if (SHAPE === "flat") {
    const N = 6, w = N * CW, Z0 = 22;
    for (let i = 0; i < N; i++) cols.push({ c: [(i + 0.5) * CW - w / 2, D], n: [0, 1] });
    return { cols, Z0, run: [[0, N]], parts: [
      ["plate", -w / 2 - 8, -14, w / 2 + 8, 12, -4, 0],
      ["post", -w / 2 + 14, -1, 0, Z0], ["post", w / 2 - 14, -1, 0, Z0],
      ["slab", -w / 2, 0, w / 2, D, Z0, Z0 + ROWS * CH],
    ] };
  }
  if (SHAPE === "corner") {
    const N = 3, L = N * CW + 12, H = 96, Z0 = H - ROWS * CH - 8;
    for (let i = 0; i < N; i++) cols.push({ c: [L + D, L - (N - 0.5 - i) * CW], n: [1, 0] });
    for (let i = 0; i < N; i++) cols.push({ c: [L - (i + 0.5) * CW, L + D], n: [0, 1] });
    return { cols, Z0, run: [[0, N], [N, 2 * N]], parts: [
      ["block", 0, 0, L, L, 0, H],
      ["slab", L, L - N * CW, L + D, L, Z0, Z0 + ROWS * CH],
      ["slab", L - N * CW, L, L + D, L + D, Z0, Z0 + ROWS * CH],
    ] };
  }
  if (SHAPE === "curved") {
    const N = 7, R = 72, step = CW / R, a0 = Math.PI * 1.25 - ((N - 1) / 2) * step;
    for (let i = 0; i < N; i++) { const a = a0 + i * step; cols.push({ c: [(R - D) * Math.cos(a), (R - D) * Math.sin(a)], n: [-Math.cos(a), -Math.sin(a)], a, R }); }
    return { cols, Z0: 0, run: [], parts: [["arc"]] };
  }
  const N = 10, R = (N * CW) / (2 * Math.PI), Z0 = 10;
  for (let i = 0; i < N; i++) { const a = (i / N) * 2 * Math.PI + Math.PI / 4 + Math.PI / N; cols.push({ c: [R * Math.cos(a), R * Math.sin(a)], n: [Math.cos(a), Math.sin(a)], a, R }); }
  return { cols, Z0, run: [], parts: [["disc", R + 8, -4, 0], ["disc", R - 3, 0, Z0], ["disc", R, Z0, Z0 + ROWS * CH], ["disc", R - 3, Z0 + ROWS * CH, Z0 + ROWS * CH + 4]] };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, near = null;
  const L = layout(), top = L.Z0 + ROWS * CH;
  const ext = L.cols.flatMap((k) => [0, top].map((z) => [k.c[0] + k.n[0] * PUSH, k.c[1] + k.n[1] * PUSH, z]));
  const C = Cam(45, 0.5, 2.7);
  fit(C, ext.concat([[-40, -40, 0]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the structure, then the face's seams (dim), back to front
  const tangent = (k) => [-k.n[1], k.n[0]];
  const onFace = (k, u, z) => { const t = tangent(k); return P(k.c[0] + t[0] * u, k.c[1] + t[1] * u, z); };
  for (const [kind, ...a] of L.parts) {
    if (kind === "plate" || kind === "block" || kind === "slab") { const [x0, y0, x1, y1, z0, z1] = a; const [ring, inner] = rings(x0, y0, x1, y1, R_EDGE, kind === "slab" ? 0.6 : 1.6); put(solid(g), prism(P, front, ring, inner, z0, z1)); }
    if (kind === "post") { const [x, y, z0, z1] = a; const [ring, inner] = rings(x - 2.2, y - 4.4, x + 2.2, y, R_EDGE, 0.7); put(solid(g), prism(P, front, ring, inner, z0, z1)); }
    if (kind === "disc") { const [r, z0, z1] = a; put(solid(g), prism(P, front, circ(r, 48), circ(r - 1.6, 48), z0, z1)); }
    if (kind === "arc") for (const k of L.cols) { const t = tangent(k), h = CW / 2, b = [k.c[0] - k.n[0] * D, k.c[1] - k.n[1] * D]; const pts = [-h, h].flatMap((u) => [0, top].flatMap((z) => [P(k.c[0] + t[0] * u, k.c[1] + t[1] * u, z), P(b[0] + t[0] * u, b[1] + t[1] * u, z)])); mk("path", { d: poly(hull(pts)) }, g); }
  }
  const seams = [];
  const seen = (k) => dot2(k.n, V) > 0.12;
  L.cols.forEach((k, i) => { if (!seen(k)) return; for (let j = 1; j < ROWS; j++) seams.push(seg(onFace(k, -CW / 2, L.Z0 + j * CH), onFace(k, CW / 2, L.Z0 + j * CH))); });
  for (const [s, e] of L.run) for (let i = s + 1; i < e; i++) seams.push(seg(onFace(L.cols[i], -CW / 2, L.Z0), onFace(L.cols[i], -CW / 2, top)));
  if (SHAPE === "column") L.cols.forEach((k) => { if (seen(k)) seams.push(seg(onFace(k, -CW / 2, L.Z0), onFace(k, -CW / 2, top))); });
  mk("path", { d: seams.join(" "), class: "nf lo" }, g);

  // the cabinets: one solid each, drawn only once out of the face
  const ring = rrect(-CW / 2 + 0.3, 0.3, CW / 2 - 0.3, CH - 0.3, R_EDGE, 2), inner = rrect(-CW / 2 + 1.3, 1.3, CW / 2 - 1.3, CH - 1.3, R_EDGE / 2, 2);
  const cabs = [];
  L.cols.forEach((k, i) => { if (!seen(k)) return; for (let j = 0; j < ROWS; j++) {
    const z0 = L.Z0 + j * CH, r = REST.find((q) => q[0] === i && q[1] === j), e0 = r ? r[2] * PUSH : 0;
    cabs.push({ ...k, t: tangent(k), i, j, z0, e0, sp: spring(e0, { eps: 0.02 }), el: solid(g), drawn: NaN, at: onFace(k, 0, z0 + CH / 2) });
  } });
  const restMark = cabs.reduce((a, b) => (b.e0 > a.e0 ? b : a));
  let lit = restMark, order = [];

  function draw(k) {
    const e = k.sp.x < SHOW ? 0 : k.sp.x;
    if (e === k.drawn) return;
    k.drawn = e;
    if (!e) { put(k.el, { sil: "", crease: "" }); return; }
    const at = (q, d) => P(k.c[0] + k.t[0] * q.u + k.n[0] * d, k.c[1] + k.t[1] * q.u + k.n[1] * d, k.z0 + q.v);
    put(k.el, { sil: poly(hull(ring.map((q) => at(q, e - D)).concat(ring.map((q) => at(q, e))))), crease: poly(inner.map((q) => at(q, e))) });
  }
  const depth = (k) => dot2([k.c[0] + k.n[0] * k.sp.x, k.c[1] + k.n[1] * k.sp.x], V) + k.z0 * 0.004;
  function sort() {
    const next = cabs.slice().sort((a, b) => depth(a) - depth(b));
    if (next.every((k, i) => k === order[i])) return;
    order = next;
    for (const k of order) g.append(k.el.g);
  }
  const light = () => { for (const k of cabs) k.el.sil.classList.toggle("hi", k === lit); };

  const Bk = register(stage, (dt) => {
    let m = false;
    for (const k of cabs) { if (stepS(k.sp, dt)) m = true; draw(k); }
    sort();
    return m;
  });
  bag.add(Bk.unregister);

  function retarget() {
    if (!near) { for (const k of cabs) k.sp.t = k.e0; lit = restMark; read.textContent = "rest"; }
    else {
      let best = null, bd = Infinity;
      for (const k of cabs) {
        const d = Math.hypot(near[0] - k.at[0], near[1] - k.at[1]), f = clamp(1 - d / reach, 0, 1);
        k.sp.t = PUSH * f * f * (3 - 2 * f);
        if (d < bd) { bd = d; best = k; }
      }
      lit = best;
      read.textContent = `cab ${best.i + 1}·${best.j + 1}`;
    }
    light();
    Bk.wake();
  }

  bag.add(pointer(stage, { move: (p) => { near = p; retarget(); }, leave: () => { near = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  for (const k of cabs) draw(k);
  sort();
  light();

  return { set: (v) => { reach = v; if (near) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "screen-curved",
  means: "A curved LED screen: the cabinets near the pointer slide out of the arc toward you.",
  rules: [1, 3, 5, 6],
  range: [35, 55, 85],
  mount,
});

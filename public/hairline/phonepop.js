/**
 * Phonepop: a phone standing on a tiled plinth. A rounded cube comes out of its
 * screen; the part still inside is cut away. The nearer the pointer is to the
 * screen's centre, the further the cube comes out, on a spring; far away it
 * sinks back. At rest it is half out. The slider is the reach, in viewBox units.
 *
 * The pattern: a continuous field with one part, as Popout and Flatpop. The hit
 * test is the distance to a fixed point (the screen's centre at rest).
 */
const {
  Cam, clamp, fit, hull, lerp, poly, prism, proj, rings, rrect, seg,
  spring, stepS, facing, mk, pointer, put, register, disposer, solid,
} = HL;

const W = 36, BD = 5, Z0 = 6, BH = 70, X0 = -16, X1 = W + 16;    // phone, plinth top
const S = 9, CX = W / 2, ZC = 42;                                 // cube
const EMIN = -0.6 * S, EMAX = S + 14, REST = 0.5, FLOOR = 0.12;

/** A slab standing on its edge, its face a rounded rectangle in x-z, from y0 to y1: silhouette and the face's crease. */
function slab(P, x0, x1, z0, z1, y0, y1, r, b) {
  const ring = rrect(x0, z0, x1, z1, r, 6), inner = rrect(x0 + b, z0 + b, x1 - b, z1 - b, r - b, 6);
  const pts = ring.map((q) => P(q.u, y0, q.v)).concat(ring.map((q) => P(q.u, y1, q.v)));
  return { sil: poly(hull(pts)), crease: poly(inner.map((q) => P(q.u, y1, q.v))) };
}

/** A rounded rectangle lying on the face y, as a path. */
const onFace = (P, x0, z0, x1, z1, r, y) => poly(rrect(x0, z0, x1, z1, r, 6).map((q) => P(q.u, y, q.v)));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, near = null;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[X0, -16, 0], [X1, 28, 0], [X1, -16, 0], [X0, 28, 0], [0, 0, Z0 + BH], [CX + S, BD + EMAX + S, ZC + S]].map(([x, y, z]) => [y, x, z]), 200, 166);
  // mirrored across the diagonal, so the cube comes out to the right, as in Popout
  const P0 = proj(C), P = (x, y, z) => P0(y, x, z), front = facing(C);

  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, ring, inner, z0, z1)); };
  block(X0, -16, X1, 28, 4, 1.8, 0, Z0);                                       // the plinth
  const seams = [-2, 11, 25, 38].map((x) => seg(P(x, -14, Z0), P(x, 26, Z0))).join("") + seg(P(X0 + 2, 13, Z0), P(X1 - 2, 13, Z0));
  mk("path", { d: seams, class: "nf lo" }, g);                                 // its tiles, under the phone
  put(solid(g), slab(P, 0, W, Z0, Z0 + BH, 0, BD, 7, 1.2));                     // the phone
  mk("path", { d: onFace(P, 3, Z0 + 3, W - 3, Z0 + BH - 3, 5, BD), class: "nf" }, g);        // the screen
  mk("path", { d: onFace(P, W / 2 - 5, Z0 + BH - 7, W / 2 + 5, Z0 + BH - 4.6, 1.2, BD), class: "nf" }, g); // the notch
  mk("path", { d: seg(P(W, BD / 2, Z0 + 46), P(W, BD / 2, Z0 + 56)), class: "nf lo" }, g);   // the side button

  const box = solid(g);
  box.sil.classList.add("hi");
  const sp = spring(REST, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    if (sp.x === drawn) return;
    drawn = sp.x;
    const e = lerp(EMIN, EMAX, clamp(sp.x, 0, 1.05));
    const y0 = Math.max(BD, BD + e - S), y1 = BD + e + S;
    const [ring, inner] = rings(CX - S, y0, CX + S, y1, 2.6, Math.min(1.5, (y1 - y0) / 3));
    put(box, prism(P, front, ring, inner, ZC - S, ZC + S));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  // the answer: 1 at the screen's centre, down to the floor at the reach, and the floor beyond
  const centre = P(CX, BD, ZC);
  function retarget() {
    if (!near) { sp.t = REST; read.textContent = "rest"; }
    else {
      const k = clamp(1 - Math.hypot(near[0] - centre[0], near[1] - centre[1]) / R, 0, 1);
      sp.t = lerp(FLOOR, 1, k * k * (3 - 2 * k));
      read.textContent = `depth ${Math.round(sp.t * 100)}%`;
    }
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { near = p; retarget(); },
    leave: () => { near = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();

  return {
    set: (v) => { R = v; if (near) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "phonepop",
  means: "A phone on a plinth: the nearer the pointer to its screen, the further the cube comes out of it.",
  rules: [1, 3, 5, 6],
  range: [60, 110, 170],
  mount,
});

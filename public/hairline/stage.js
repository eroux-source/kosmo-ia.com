/**
 * Stage: an event stage with an LED wall standing at its back and a speaker on
 * each front corner. A rounded cube comes out of the wall over the stage. The
 * nearer the pointer is to the wall's centre, the further the cube comes out,
 * on a spring; far away it sinks back. At rest it is half out. The slider is
 * the reach, in viewBox units.
 *
 * The pattern: Flatpop's, a continuous field with one part. The hit test is the
 * distance to a fixed point (the wall's centre at rest), which never moves.
 */
const {
  Cam, clamp, fit, hull, lerp, poly, prism, proj, rings, rrect, seg,
  spring, stepS, facing, mk, pointer, put, register, disposer, solid,
} = HL;

const W = 84, X0 = -16, X1 = W + 16, ZS = 14;                   // wall width, stage, stage height
const Y0 = -14, Y1 = 46, WY0 = -8, WY1 = -3;                    // stage depth, wall's thickness
const WZ0 = ZS + 8, WZ1 = ZS + 58;                              // wall, bottom and top
const S = 11, CX = W / 2, ZC = (WZ0 + WZ1) / 2;                 // cube
const EMIN = -0.6 * S, EMAX = S + 16, REST = 0.5, FLOOR = 0.12;

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
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[X0, Y0, 0], [X1, Y1, 0], [X1, Y0, 0], [X0, Y1, 0], [X0, WY0, WZ1], [CX + S, WY1 + EMAX + S, ZC + S]].map(([x, y, z]) => [y, x, z]), 200, 166);
  // mirrored across the diagonal, so the cube comes out to the right, as in Popout
  const P0 = proj(C), P = (x, y, z) => P0(y, x, z), front = facing(C);

  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, ring, inner, z0, z1)); };
  block(X0, Y0, X1, Y1, 3.5, 1.8, 0, ZS);                                        // the stage
  mk("path", { d: seg(P(X0 + 4, Y1 - 6, ZS), P(X1 - 4, Y1 - 6, ZS)), class: "nf dash" }, g); // the stage's edge marking
  for (const x of [8, W - 8]) block(x - 2, WY0 - 1, x + 2, WY0 + 3, 1, 0.4, ZS, WZ0);  // the wall's legs
  put(solid(g), slab(P, 0, W, WZ0, WZ1, WY0, WY1, 3, 1.3));                      // the LED wall
  mk("path", { d: onFace(P, 3, WZ0 + 3, W - 3, WZ1 - 3, 1.8, WY1), class: "nf lo" }, g); // the panel
  block(X0 + 2, Y1 - 16, X0 + 14, Y1 - 4, 2, 0.9, ZS, ZS + 18);                  // the left speaker

  const box = solid(g);
  box.sil.classList.add("hi");
  const sp = spring(REST, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    if (sp.x === drawn) return;
    drawn = sp.x;
    const e = lerp(EMIN, EMAX, clamp(sp.x, 0, 1.05));
    const y0 = Math.max(WY1, WY1 + e - S), y1 = WY1 + e + S;
    const [ring, inner] = rings(CX - S, y0, CX + S, y1, 2.6, Math.min(1.5, (y1 - y0) / 3));
    put(box, prism(P, front, ring, inner, ZC - S, ZC + S));
  }
  const right = solid(g);                                                        // the right speaker, nearest of all
  { const [ring, inner] = rings(X1 - 14, Y1 - 16, X1 - 2, Y1 - 4, 2, 0.9); put(right, prism(P, front, ring, inner, ZS, ZS + 18)); }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  // the answer: 1 at the wall's centre, down to the floor at the reach, and the floor beyond
  const centre = P(CX, WY1, ZC);
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
  name: "stage",
  means: "An event stage: the nearer the pointer to the LED wall, the further the cube comes out over the stage.",
  rules: [1, 3, 5, 6],
  range: [60, 110, 170],
  mount,
});

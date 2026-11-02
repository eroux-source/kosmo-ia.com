/**
 * Storefront: a shop front on a pavement, an awning over its window, a door
 * beside it. The shop window is a screen: a rounded cube comes out of it toward
 * the street. The nearer the pointer is to the window's centre, the further the
 * cube comes out, on a spring; far away it sinks back. At rest it is half out.
 * The slider is the reach, in viewBox units.
 *
 * The pattern: Flatpop's, a continuous field with one part. The hit test is the
 * distance to a fixed point (the window's centre at rest), which never moves.
 */
const {
  Cam, clamp, fit, hull, lerp, poly, prism, proj, rings, rrect, seg,
  spring, stepS, facing, mk, pointer, put, register, disposer, solid,
} = HL;

const W = 60, X0 = -14, X1 = W + 22, ZP = 4, FH = 92, FD = 6;   // window width, pavement, facade
const WZ0 = ZP + 12, WZ1 = ZP + 60;                             // window, bottom and top
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
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[X0, -16, 0], [X1, 52, 0], [X1, -16, 0], [X0, 52, 0], [X0, -FD, ZP + FH], [CX + S, EMAX + S, ZC + S]].map(([x, y, z]) => [y, x, z]), 200, 166);
  // mirrored across the diagonal, so the cube comes out to the right, as in Popout
  const P0 = proj(C), P = (x, y, z) => P0(y, x, z), front = facing(C);

  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const [ring, inner] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, ring, inner, z0, z1)); };
  block(X0, -16, X1, 52, 4, 1.8, 0, ZP);                                         // the pavement
  mk("path", { d: seg(P(X0 + 4, 44, ZP), P(X1 - 4, 44, ZP)), class: "nf dash" }, g); // the kerb line
  put(solid(g), slab(P, X0 + 2, X1 - 2, ZP, ZP + FH, -FD, 0, 3.5, 1.4));          // the facade
  mk("path", { d: onFace(P, -2, WZ0 - 3, W + 2, WZ1 + 3, 2.4, 0), class: "nf" }, g);   // the window's frame
  mk("path", { d: onFace(P, 2, WZ0, W - 2, WZ1, 1.6, 0), class: "nf lo" }, g);         // the glass
  mk("path", { d: onFace(P, W + 6, ZP, X1 - 6, ZP + 54, 1.6, 0), class: "nf" }, g);    // the door
  mk("path", { d: onFace(P, -2, ZP + FH - 16, X1 - 6, ZP + FH - 6, 1.6, 0), class: "nf lo" }, g); // the sign band, blank
  block(-4, 0, W + 4, 12, 1.6, 0.6, WZ1 + 8, WZ1 + 11);                           // the awning

  const box = solid(g);
  box.sil.classList.add("hi");
  const sp = spring(REST, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    if (sp.x === drawn) return;
    drawn = sp.x;
    const e = lerp(EMIN, EMAX, clamp(sp.x, 0, 1.05));
    const y0 = Math.max(0, e - S), y1 = e + S;
    const [ring, inner] = rings(CX - S, y0, CX + S, y1, 2.6, Math.min(1.5, (y1 - y0) / 3));
    put(box, prism(P, front, ring, inner, ZC - S, ZC + S));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  // the answer: 1 at the window's centre, down to the floor at the reach, and the floor beyond
  const centre = P(CX, 0, ZC);
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
  name: "storefront",
  means: "A shop front: the nearer the pointer to the window, the further the cube comes out of the glass toward the street.",
  rules: [1, 3, 5, 6],
  range: [60, 110, 170],
  mount,
});

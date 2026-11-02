/**
 * Pop-out: a skyscraper on a plaza, with a 3D billboard wrapped round its
 * nearest corner. A rounded cube comes out of the screen, through the facade:
 * the part still inside the tower is cut away, so its top shows a notch where
 * it meets the two faces. The nearer the pointer is to the screen's corner, the
 * further the cube comes out, on a spring; far away it sinks back in. At rest
 * it is half out. The slider is the reach, in viewBox units.
 *
 * The pattern: a continuous field with one part. The hit test is the distance
 * to a fixed point (the screen's corner at rest), which never moves.
 */
const {
  Cam, clamp, facing, fillet, fit, lerp, open, poly, prism, proj, rings,
  spring, stepS, mk, pointer, put, register, disposer, solid,
} = HL;

const T = 44, PD = 8, PH = 12, TOP = 150, PL = 30;          // tower side, podium, top, plaza margin
const ZC = 96, S = 15, SW = 40, SH = 26, CR = 4;           // screen centre, cube half-side, screen half-sizes, corner radius
const EMIN = -0.6 * S, EMAX = S + 10, REST = 0.5, FLOOR = 0.12;

/** The cube pushed e out of the corner, cut by the tower: its silhouette and its crease. */
function cube(P, e) {
  const a = T + e - S, b = T + e + S, w = Math.max(T, a), bi = 1.6, z0 = ZC - S, z1 = ZC + S;
  const L = a < T - 0.6;
  const plan = L ? [[a, b], [b, b], [b, a], [w, a], [w, w], [a, w]] : [[a, b], [b, b], [b, a], [a, a]];
  const inner = L
    ? [[a + bi, b - bi], [b - bi, b - bi], [b - bi, a + bi], [w + bi, a + bi], [w + bi, w + bi], [a + bi, w + bi]]
    : [[a + bi, b - bi], [b - bi, b - bi], [b - bi, a + bi], [a + bi, a + bi]];
  const ring = fillet(plan, plan.map((_, i) => (i < 3 ? 3.2 : 0.8)), 4);
  const sx = ring.map((p) => P(p[0], p[1], z0)[0]);
  let l = 0, r = 0;
  sx.forEach((v, i) => { if (v < sx[l]) l = i; if (v > sx[r]) r = i; });
  // the near faces' foot, left to right, then the top's back edge (and its notch) from right to left
  const foot = ring.slice(l, r + 1).map((p) => P(p[0], p[1], z0));
  const back = ring.slice(r).concat(ring.slice(0, l + 1)).map((p) => P(p[0], p[1], z1));
  const cr = fillet(inner, inner.map((_, i) => (i < 3 ? 2 : 0.5)), 4).slice(2, 13).map((p) => P(p[0], p[1], z1));
  return { sil: poly(foot.concat(back)), crease: open(cr) };
}

/** The screen's outline on the two near faces, wrapping the rounded corner; d widens it by d on every side. */
function screen(P, d) {
  const arc = [];
  for (let k = 0; k <= 6; k++) {
    const t = (k / 6) * Math.PI / 2;
    arc.push([T - CR + CR * Math.cos(t), T - CR + CR * Math.sin(t)]);
  }
  const plan = [[T, T - SW + d], ...arc, [T - SW + d, T]];
  const lo = plan.map((p) => P(p[0], p[1], ZC - SH + d)), hi = plan.map((p) => P(p[0], p[1], ZC + SH - d)).reverse();
  const pts = lo.concat(hi), last = plan.length - 1;
  return poly(fillet(pts, pts.map((_, i) => (i === 0 || i === last || i === last + 1 || i === pts.length - 1 ? 2.6 : 0.01)), 4));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value, near = null;
  const C = Cam(32, 0.5, 1.32); // turned off the diagonal, so coming out of the corner reads as depth
  fit(C, [[-PL, -PL, -4], [T + PL, T + PL, -4], [T + PL, -PL, -4], [-PL, T + PL, -4], [T / 2, T / 2, TOP + 22]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const block = (x0, x1, r, b, z0, z1) => { const [ring, inner] = rings(x0, x0, x1, x1, r, b); put(solid(g), prism(P, front, ring, inner, z0, z1)); return ring; };
  block(-PL, T + PL, 10, 2.2, -4, 0);                    // the plaza
  block(-PD, T + PD, 6, 2, 0, PH);                       // the podium
  block(0, T, CR, 1.6, PH, TOP);                         // the shaft
  // windows on the two near faces, above and below the screen: one path per face
  const win = (on) => {
    let d = "";
    for (let z = PH + 7; z + 6 < TOP - 4; z += 10) {
      if (z + 6 > ZC - SH - 3 && z < ZC + SH + 3) continue;
      for (let c = 8; c <= T - 8; c += 7) {
        const q = [[c - 1.7, z], [c + 1.7, z], [c + 1.7, z + 6], [c - 1.7, z + 6]].map(([u, v]) => P(...on(u), v));
        d += poly(fillet(q, [0.5, 0.5, 0.5, 0.5], 2));
      }
    }
    mk("path", { d, class: "nf lo" }, g);
  };
  win((u) => [u, T]);
  win((u) => [T, u]);
  block(6, T - 6, 4, 1.4, TOP, TOP + 12);                // two setbacks
  block(13, T - 13, 3, 1.2, TOP + 12, TOP + 22);
  mk("path", { d: screen(P, 0) }, g);                    // the screen, its bezel
  mk("path", { d: screen(P, 3), class: "nf lo" }, g);

  const box = solid(g);
  box.sil.classList.add("hi");
  const sp = spring(REST, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const f = sp.x;
    if (f === drawn) return;
    drawn = f;
    put(box, cube(P, lerp(EMIN, EMAX, clamp(f, 0, 1.05))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  // the answer: 1 at the corner, down to the floor at the reach, and the floor beyond
  const corner = P(T, T, ZC);
  function retarget() {
    if (!near) { sp.t = REST; read.textContent = "rest"; }
    else {
      const u = Math.hypot(near[0] - corner[0], near[1] - corner[1]) / R;
      const k = clamp(1 - u, 0, 1);
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
  name: "popout",
  means: "A tower's corner screen: the nearer the pointer to the corner, the further the cube comes out through the facade.",
  rules: [1, 3, 5, 6],
  range: [60, 110, 170],
  mount,
});

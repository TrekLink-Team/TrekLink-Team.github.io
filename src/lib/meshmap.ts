/**
 * Build-time geometry for the mesh map: a small radio mesh laid over a
 * generated terrain map. Everything is derived from one seed, so the map is
 * identical on every build and every locale, and nothing is fetched.
 *
 * The mesh is a unit-disc graph, which is what a LoRa mesh actually is: two
 * nodes are linked when they are within radio range of each other. Nodes are
 * placed on a jittered lattice inside a route-shaped band, so the graph has
 * loops through the middle and a few edge nodes that hang off one link.
 */

export const W = 1000;
export const H = 560;

export type NodeKind = 'trekker' | 'guide' | 'station';
export interface MeshNode {
  id: number;
  x: number;
  y: number;
  kind: NodeKind;
}
export interface MeshEdge {
  a: number;
  b: number;
}

/** Mulberry32: tiny, fast, good enough for layout. */
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => Math.round(n * 10) / 10;

/* ---------------------------------------------------------------- mesh -- */

export function buildMesh(seed = 7) {
  const rand = rng(seed);
  const nodes: MeshNode[] = [];

  // A route band that climbs from the lower left to the upper right.
  const cols = 8;
  const rows = 3;
  for (let c = 0; c < cols; c += 1) {
    for (let r = 0; r < rows; r += 1) {
      // Thin the lattice so it reads as people on a trail, not a grid.
      if (rand() < 0.22) continue;
      const u = (c + 0.5) / cols;
      const bandY = H * (0.72 - 0.42 * u);
      const x = 70 + u * (W - 180) + (rand() - 0.5) * 70;
      const y = bandY + (r - 1) * 92 + (rand() - 0.5) * 50;
      nodes.push({ id: nodes.length, x: f(x), y: f(Math.max(50, Math.min(H - 50, y))), kind: 'trekker' });
    }
  }
  // Two edge nodes: stragglers off the band, one link each at most.
  nodes.push({ id: nodes.length, x: 150, y: f(H * 0.32), kind: 'trekker' });
  nodes.push({ id: nodes.length, x: f(W * 0.62), y: f(H * 0.88), kind: 'trekker' });

  // The basecamp station sits off the far end of the route.
  const station: MeshNode = { id: nodes.length, x: W - 70, y: 92, kind: 'station' };
  nodes.push(station);

  // The guide walks near the middle of the group.
  const mid = nodes
    .filter((n) => n.kind === 'trekker')
    .sort((p, q) => Math.hypot(p.x - W * 0.45, p.y - H * 0.5) - Math.hypot(q.x - W * 0.45, q.y - H * 0.5))[0]!;
  mid.kind = 'guide';

  // Radio range: link every pair within R.
  const R = 195;
  const edges: MeshEdge[] = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const d = Math.hypot(nodes[i]!.x - nodes[j]!.x, nodes[i]!.y - nodes[j]!.y);
      if (d <= R) edges.push({ a: i, b: j });
    }
  }
  // Guarantee one connected mesh: join any island to its nearest neighbour.
  const connected = () => {
    const seen = new Set([0]);
    const stack = [0];
    while (stack.length) {
      const n = stack.pop()!;
      for (const e of edges) {
        const o = e.a === n ? e.b : e.b === n ? e.a : -1;
        if (o >= 0 && !seen.has(o)) {
          seen.add(o);
          stack.push(o);
        }
      }
    }
    return seen;
  };
  for (let guard = 0; guard < nodes.length; guard += 1) {
    const seen = connected();
    if (seen.size === nodes.length) break;
    let best: [number, number, number] = [0, 0, Infinity];
    for (const i of seen)
      for (let j = 0; j < nodes.length; j += 1) {
        if (seen.has(j)) continue;
        const d = Math.hypot(nodes[i]!.x - nodes[j]!.x, nodes[i]!.y - nodes[j]!.y);
        if (d < best[2]) best = [i, j, d];
      }
    edges.push({ a: best[0], b: best[1] });
  }

  return { nodes, edges };
}

/** Hop count from an origin to every node (breadth-first). */
export function hops(n: number, edges: MeshEdge[], origin: number): number[] {
  const out = Array<number>(n).fill(Infinity);
  out[origin] = 0;
  const queue = [origin];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const e of edges) {
      const o = e.a === cur ? e.b : e.b === cur ? e.a : -1;
      if (o >= 0 && out[o] === Infinity) {
        out[o] = out[cur]! + 1;
        queue.push(o);
      }
    }
  }
  return out;
}

/* ----------------------------------------------------------------- map -- */

/** Catmull-Rom through points, as a smooth SVG path. */
function smooth(pts: [number, number][], closed = false): string {
  const p = closed ? [pts[pts.length - 1]!, ...pts, pts[0]!, pts[1]!] : [pts[0]!, ...pts, pts[pts.length - 1]!];
  let d = `M${f(p[1]![0])} ${f(p[1]![1])}`;
  for (let i = 1; i < p.length - 2; i += 1) {
    const [x0, y0] = p[i - 1]!;
    const [x1, y1] = p[i]!;
    const [x2, y2] = p[i + 1]!;
    const [x3, y3] = p[i + 2]!;
    d += `C${f(x1 + (x2 - x0) / 6)} ${f(y1 + (y2 - y0) / 6)} ${f(x2 - (x3 - x1) / 6)} ${f(y2 - (y3 - y1) / 6)} ${f(x2)} ${f(y2)}`;
  }
  return closed ? `${d}Z` : d;
}

export function buildMap(seed = 23) {
  const rand = rng(seed);
  const pad = 80;

  // Contours: nested noisy rings around two summits.
  const contours: string[] = [];
  const summits: [number, number, number][] = [
    [W * 0.3, H * 0.28, 1],
    [W * 0.78, H * 0.62, 0.85],
  ];
  for (const [cx, cy, s] of summits) {
    const phase = rand() * Math.PI * 2;
    for (let k = 1; k <= 9; k += 1) {
      const pts: [number, number][] = [];
      const base = 22 * k * s;
      for (let a = 0; a < 18; a += 1) {
        const th = (a / 18) * Math.PI * 2;
        const wob = 1 + 0.18 * Math.sin(th * 3 + phase + k * 0.4) + 0.08 * Math.sin(th * 5 - phase);
        pts.push([cx + Math.cos(th) * base * 1.5 * wob, cy + Math.sin(th) * base * wob]);
      }
      contours.push(smooth(pts, true));
    }
  }

  // A river: a random walk across the map, smoothed.
  const river: [number, number][] = [];
  let ry = H * 0.15;
  for (let x = -pad; x <= W + pad; x += 110) {
    ry += (rand() - 0.35) * 70;
    river.push([x, Math.max(30, Math.min(H - 30, ry))]);
  }
  const riverPath = smooth(river);

  // A lake near the station.
  const lake: [number, number][] = [];
  for (let a = 0; a < 12; a += 1) {
    const th = (a / 12) * Math.PI * 2;
    const r = 40 + rand() * 18;
    lake.push([W * 0.9 + Math.cos(th) * r * 1.4, H * 0.42 + Math.sin(th) * r]);
  }

  // Roads: two major roads and a scatter of minor tracks.
  const road = (y0: number, y1: number, steps: number, amp: number): string => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= steps; i += 1) {
      const u = i / steps;
      pts.push([-pad + u * (W + 2 * pad), y0 + (y1 - y0) * u + (rand() - 0.5) * amp]);
    }
    return smooth(pts);
  };
  const major = [road(H * 0.92, H * 0.2, 7, 60), road(H * 0.1, H * 0.95, 6, 80)];
  const minor: string[] = [];
  for (let i = 0; i < 9; i += 1) {
    const x0 = rand() * W;
    const y0 = rand() * H;
    const pts: [number, number][] = [[x0, y0]];
    let ang = rand() * Math.PI * 2;
    for (let s = 0; s < 5; s += 1) {
      ang += (rand() - 0.5) * 1.2;
      const [px, py] = pts[pts.length - 1]!;
      pts.push([px + Math.cos(ang) * 70, py + Math.sin(ang) * 70]);
    }
    minor.push(smooth(pts));
  }

  // A village street grid around the station: small blocks.
  const blocks: { x: number; y: number; w: number; h: number }[] = [];
  for (let i = 0; i < 16; i += 1) {
    const gx = W * 0.8 + (i % 4) * 34 + (rand() - 0.5) * 6;
    const gy = 20 + Math.floor(i / 4) * 30 + (rand() - 0.5) * 6;
    if (rand() < 0.25) continue;
    blocks.push({ x: f(gx), y: f(gy), w: f(22 + rand() * 8), h: f(16 + rand() * 8) });
  }

  return { contours, riverPath, lakePath: smooth(lake, true), major, minor, blocks };
}

import { hops } from '../lib/meshmap';
import { reducedMotion } from '../lib/motion';

/**
 * Mesh map: a new SOS origin for every wave.
 *
 * The markup already animates one wave from a fixed node with CSS alone. This
 * reads the link list, and at the end of each cycle picks a random trekker or
 * guide node, recomputes hop counts breadth-first, redraws each link from its
 * nearer end, moves the droplet and restarts every animation in step.
 * Reduced motion: nothing changes.
 */
export function mountMeshMap(): void {
  const svg = document.querySelector<SVGSVGElement>('[data-mesh]');
  if (!svg) return;
  if (reducedMotion()) return;

  const edges = (JSON.parse(svg.dataset.edges ?? '[]') as [number, number][]).map(
    ([a, b]) => ({ a, b }),
  );
  const pos = JSON.parse(svg.dataset.pos ?? '[]') as [number, number][];
  const nodes = Array.from(svg.querySelectorAll<SVGGElement>('[data-node]'));
  const links = Array.from(svg.querySelectorAll<SVGGElement>('.link'));
  const droplet = svg.querySelector<SVGGElement>('[data-droplet]');
  const trigger = svg.querySelector<SVGCircleElement>('[data-droplet-ring]');
  if (!nodes.length || pos.length !== nodes.length || !droplet || !trigger) return;

  const candidates = nodes
    .filter((n) => !n.classList.contains('node-station'))
    .map((n) => Number(n.dataset.node));
  let current = Number(svg.dataset.origin);

  function wave(): void {
    let next = current;
    while (next === current && candidates.length > 1) {
      next = candidates[Math.floor(Math.random() * candidates.length)]!;
    }
    current = next;
    const hop = hops(nodes.length, edges, current);

    nodes.forEach((n, i) => {
      n.style.setProperty('--hop', String(hop[i]));
      n.classList.toggle('origin', i === current);
    });
    links.forEach((l) => {
      let a = Number(l.dataset.a);
      let b = Number(l.dataset.b);
      if (hop[a]! > hop[b]!) [a, b] = [b, a];
      l.style.setProperty('--hop', String(hop[a]));
      l.classList.toggle('same', hop[a] === hop[b]);
      l.querySelectorAll('line').forEach((line) => {
        line.setAttribute('x1', String(pos[a]![0]));
        line.setAttribute('y1', String(pos[a]![1]));
        line.setAttribute('x2', String(pos[b]![0]));
        line.setAttribute('y2', String(pos[b]![1]));
      });
    });
    droplet!.style.transform = `translate(${pos[current]![0]}px, ${pos[current]![1]}px)`;

    // Restart every animation together so the wave stays coherent.
    svg!.classList.remove('run');
    void svg!.getBoundingClientRect();
    svg!.classList.add('run');
  }

  // One wave per cycle. Offscreen the animations are paused (see the reveal
  // island's [data-loop] handling), so no iteration fires and no wave runs.
  trigger.addEventListener('animationiteration', wave);
}

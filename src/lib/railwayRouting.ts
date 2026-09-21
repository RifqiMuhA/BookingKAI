// ============================================================
// RAILWAY ROUTING GRAPH FOR JAVA RAIL NETWORK
// Uses exact OpenStreetMap railway alignments from railways.json
// ============================================================

import rawRailwayEdges from "@/data/railway_edges.json";

export interface RouteEdge {
  from: string;
  to: string;
  points: [number, number][]; // [lat, lng] array
}

// Exact railway alignment waypoints extracted directly from OSM railways.json
export const RAILWAY_EDGES: RouteEdge[] = rawRailwayEdges as RouteEdge[];

// Helper: Find route using Breadth-First Search (BFS) on the railway graph
export function getRailwayRouteCoordinates(
  originCode: string,
  destCode: string
): [number, number][] {
  if (!originCode || !destCode || originCode === destCode) {
    return [];
  }

  // Build adjacency list
  const adj = new Map<string, { to: string; points: [number, number][] }[]>();

  const addEdge = (u: string, v: string, pts: [number, number][]) => {
    if (!adj.has(u)) adj.set(u, []);
    adj.get(u)!.push({ to: v, points: pts });
  };

  for (const edge of RAILWAY_EDGES) {
    addEdge(edge.from, edge.to, edge.points);
    addEdge(edge.to, edge.from, [...edge.points].reverse());
  }

  // BFS Queue: [currentNode, accumulatedPoints]
  const queue: { node: string; path: [number, number][] }[] = [
    { node: originCode, path: [] },
  ];
  const visited = new Set<string>([originCode]);

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    if (node === destCode) {
      return path;
    }

    const neighbors = adj.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.to)) {
        visited.add(neighbor.to);

        // Stitch points together avoiding duplicate adjacent coordinate
        const newSegment = neighbor.points;
        const newPath =
          path.length === 0
            ? [...newSegment]
            : [...path, ...newSegment.slice(1)];

        queue.push({ node: neighbor.to, path: newPath });
      }
    }
  }

  return [];
}

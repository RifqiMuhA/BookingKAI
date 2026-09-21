// ============================================================
// RAILWAY ROUTING GRAPH FOR JAVA RAIL NETWORK
// Calculates realistic railway paths between any two stations
// ============================================================

export interface RouteEdge {
  from: string;
  to: string;
  points: [number, number][]; // [lat, lng] array
}

// Key realistic railway alignment waypoints between adjacent nodes
export const RAILWAY_EDGES: RouteEdge[] = [
  // Jakarta Area
  {
    from: "GMR",
    to: "PSE",
    points: [
      [-6.1767, 106.8306],
      [-6.1748, 106.8444],
    ],
  },
  {
    from: "GMR",
    to: "JNG",
    points: [
      [-6.1767, 106.8306],
      [-6.1952, 106.8450],
      [-6.2098, 106.8502],
      [-6.2150, 106.8681],
    ],
  },
  {
    from: "PSE",
    to: "JNG",
    points: [
      [-6.1748, 106.8444],
      [-6.1932, 106.8624],
      [-6.2150, 106.8681],
    ],
  },

  // Jakarta - Cirebon (Lintas Utara / Pantura Barat)
  {
    from: "JNG",
    to: "CN",
    points: [
      [-6.2150, 106.8681],
      [-6.2361, 106.9995], // Bekasi
      [-6.2554, 107.1517], // Cikarang
      [-6.4057, 107.4586], // Cikampek
      [-6.4271, 107.6918], // Pegaden Baru
      [-6.4746, 108.3092], // Jatibarang
      [-6.7053, 108.5554], // Cirebon
    ],
  },

  // Jakarta - Bandung (Lintas Priangan Barat)
  {
    from: "JNG",
    to: "BDO",
    points: [
      [-6.2150, 106.8681],
      [-6.2361, 106.9995], // Bekasi
      [-6.4057, 107.4586], // Cikampek
      [-6.5544, 107.4449], // Purwakarta
      [-6.7450, 107.4080], // Ciganea / Plered
      [-6.8418, 107.4812], // Padalarang
      [-6.8856, 107.5369], // Cimahi
      [-6.9142, 107.6022], // Bandung
    ],
  },
  {
    from: "BDO",
    to: "KAC",
    points: [
      [-6.9142, 107.6022],
      [-6.9249, 107.6464],
    ],
  },

  // Bandung - Kroya (Lintas Priangan Timur)
  {
    from: "KAC",
    to: "KYA",
    points: [
      [-6.9249, 107.6464],
      [-6.9793, 107.8385], // Cicalengka
      [-7.0984, 107.9862], // Cibatu
      [-7.3228, 108.2241], // Tasikmalaya
      [-7.3275, 108.3541], // Ciamis
      [-7.3712, 108.5412], // Banjar
      [-7.4828, 108.7964], // Sidareja
      [-7.6183, 109.1415], // Maos
      [-7.6288, 109.2536], // Kroya
    ],
  },

  // Cirebon - Purwokerto (Lintas Tengah Barat via Prupuk)
  {
    from: "CN",
    to: "PWT",
    points: [
      [-6.7053, 108.5554],
      [-6.9075, 108.7423], // Ciledug
      [-6.9388, 108.8893], // Ketanggungan
      [-7.1232, 108.9882], // Prupuk
      [-7.2435, 109.0067], // Bumiayu
      [-7.4259, 109.2205], // Purwokerto
    ],
  },

  // Cirebon - Tegal (Pantura Tengah)
  {
    from: "CN",
    to: "TG",
    points: [
      [-6.7053, 108.5554],
      [-6.8587, 108.7208], // Babakan
      [-6.8718, 109.0435], // Brebes
      [-6.8673, 109.1428], // Tegal
    ],
  },
  {
    from: "TG",
    to: "PK",
    points: [
      [-6.8673, 109.1428],
      [-6.8892, 109.3871], // Pemalang
      [-6.8890, 109.6644], // Pekalongan
    ],
  },
  {
    from: "PK",
    to: "SMC",
    points: [
      [-6.8890, 109.6644],
      [-6.9084, 109.7371], // Batang
      [-6.9744, 110.0673], // Weleri
      [-6.9729, 110.4137], // Semarang Poncol
    ],
  },
  {
    from: "SMC",
    to: "SMT",
    points: [
      [-6.9729, 110.4137],
      [-6.9644, 110.4279],
    ],
  },

  // Semarang - Cepu - Surabaya (Pantura Timur)
  {
    from: "SMT",
    to: "CU",
    points: [
      [-6.9644, 110.4279],
      [-7.0252, 110.5123], // Brumbung
      [-7.0988, 110.9023], // Ngrombo
      [-7.1956, 111.3892], // Randublatung
      [-7.1517, 111.5833], // Cepu
    ],
  },
  {
    from: "CU",
    to: "BJ",
    points: [
      [-7.1517, 111.5833],
      [-7.1643, 111.7012], // Tobo
      [-7.1611, 111.8847], // Bojonegoro
    ],
  },
  {
    from: "BJ",
    to: "SBY",
    points: [
      [-7.1611, 111.8847],
      [-7.1147, 112.1648], // Babat
      [-7.1205, 112.4158], // Lamongan
      [-7.2501, 112.6552], // Kandangan
      [-7.2458, 112.7317], // Surabaya Pasarturi
    ],
  },
  {
    from: "SBY",
    to: "SBI",
    points: [
      [-7.2458, 112.7317],
      [-7.2440, 112.7432], // Shortcut Surabaya
      [-7.2654, 112.7520], // Surabaya Gubeng
    ],
  },

  // Semarang - Solo
  {
    from: "SMT",
    to: "SLO",
    points: [
      [-6.9644, 110.4279],
      [-7.0252, 110.5123], // Brumbung
      [-7.1683, 110.6385], // Kedungjati
      [-7.2483, 110.8842], // Gundih
      [-7.5570, 110.8214], // Solo Balapan
    ],
  },

  // Purwokerto - Kroya - Kutoarjo - Yogyakarta (Lintas Selatan)
  {
    from: "PWT",
    to: "KYA",
    points: [
      [-7.4259, 109.2205],
      [-7.4983, 109.2238], // Notog
      [-7.6288, 109.2536], // Kroya
    ],
  },
  {
    from: "KYA",
    to: "KTA",
    points: [
      [-7.6288, 109.2536],
      [-7.6044, 109.5147], // Gombong
      [-7.6338, 109.5742], // Karanganyar
      [-7.6784, 109.6586], // Kebumen
      [-7.7259, 109.9118], // Kutoarjo
    ],
  },
  {
    from: "KTA",
    to: "YK",
    points: [
      [-7.7259, 109.9118],
      [-7.7842, 110.0038], // Jenar
      [-7.8587, 110.1583], // Wates
      [-7.7892, 110.3636], // Yogyakarta
    ],
  },
  {
    from: "YK",
    to: "LPN",
    points: [
      [-7.7892, 110.3636],
      [-7.7901, 110.3756],
    ],
  },
  {
    from: "YK",
    to: "SLO",
    points: [
      [-7.7892, 110.3636],
      [-7.7901, 110.3756], // Lempuyangan
      [-7.7088, 110.6052], // Klaten
      [-7.5642, 110.7964], // Purwosari
      [-7.5570, 110.8214], // Solo Balapan
    ],
  },
  {
    from: "LPN",
    to: "SLO",
    points: [
      [-7.7901, 110.3756],
      [-7.7088, 110.6052],
      [-7.5570, 110.8214],
    ],
  },

  // Solo - Madiun - Jombang - Mojokerto - Surabaya Gubeng
  {
    from: "SLO",
    to: "MN",
    points: [
      [-7.5570, 110.8214],
      [-7.4328, 111.0256], // Sragen
      [-7.3872, 111.2341], // Walikukun
      [-7.4428, 111.4589], // Ngawi
      [-7.6186, 111.5244], // Madiun
    ],
  },
  {
    from: "MN",
    to: "JG",
    points: [
      [-7.6186, 111.5244],
      [-7.5542, 111.6621], // Caruban
      [-7.6012, 111.9023], // Nganjuk
      [-7.5912, 112.0984], // Kertosono
      [-7.5583, 112.2335], // Jombang
    ],
  },
  {
    from: "JG",
    to: "MR",
    points: [
      [-7.5583, 112.2335],
      [-7.4722, 112.4337], // Mojokerto
    ],
  },
  {
    from: "MR",
    to: "SBI",
    points: [
      [-7.4722, 112.4337],
      [-7.4112, 112.5841], // Krian
      [-7.3482, 112.7042], // Sepanjang
      [-7.3012, 112.7384], // Wonokromo
      [-7.2654, 112.7520], // Surabaya Gubeng
    ],
  },

  // Surabaya Gubeng - Sidoarjo - Malang
  {
    from: "SBI",
    to: "SDA",
    points: [
      [-7.2654, 112.7520],
      [-7.3012, 112.7384], // Wonokromo
      [-7.3541, 112.7382], // Waru
      [-7.4568, 112.7214], // Sidoarjo
    ],
  },
  {
    from: "SDA",
    to: "ML",
    points: [
      [-7.4568, 112.7214],
      [-7.5982, 112.7684], // Bangil
      [-7.8341, 112.6982], // Lawang
      [-7.9774, 112.6370], // Malang
    ],
  },
  {
    from: "ML",
    to: "KAL",
    points: [
      [-7.9774, 112.6370],
      [-8.1342, 112.5741], // Kepanjen
      [-8.0821, 112.3142], // Wlingi
      [-8.1002, 112.1638], // Blitar
      [-8.1026, 112.1645], // Kalilurang
    ],
  },

  // Surabaya/Sidoarjo - Probolinggo - Jember - Banyuwangi
  {
    from: "SDA",
    to: "PB",
    points: [
      [-7.4568, 112.7214],
      [-7.5982, 112.7684], // Bangil
      [-7.6412, 112.9124], // Pasuruan
      [-7.7424, 113.2166], // Probolinggo
    ],
  },
  {
    from: "PB",
    to: "JR",
    points: [
      [-7.7424, 113.2166],
      [-8.0012, 113.2541], // Klakah
      [-8.1542, 113.4541], // Tanggul
      [-8.1952, 113.6124], // Rambipuji
      [-8.1633, 113.7027], // Jember
    ],
  },
  {
    from: "JR",
    to: "BJR",
    points: [
      [-8.1633, 113.7027],
      [-8.1254, 113.8152], // Kalisat
      [-8.2891, 113.9852], // Kalibaru
      [-8.3012, 114.2982], // Rogojampi
      [-8.1400, 114.3989], // Banyuwangi
    ],
  },
];

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

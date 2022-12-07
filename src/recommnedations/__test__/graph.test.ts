import Graph from '../graph'

//         2 -- 5
//        /      \
// 0 --> 1 -- 3 -- 6 -- 8
//        \      /
//         4 -- 7

const noCycle: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [4, 7],
  [5, 6],
  [3, 6],
  [7, 6],
  [6, 8]
];

// Graph with a cycle
const cycle: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 0],
]

// Test whether an ordering of vertices is topological
function isTopologicallySorted<V>(edges: [V, V][], sorting: V[]) {
  for (const [u, v] of edges) {
    const uIndex = sorting.indexOf(u);
    const vIndex = sorting.indexOf(v);
    if (uIndex < 0 || vIndex < 0 || uIndex >= vIndex) return false;
  }
  return true;
}

describe('recommendations graph test suite', () => {
  it('topological sort success', () => {
    const graph = new Graph(noCycle);
    const ordering = graph.topologicalSort();
    expect(isTopologicallySorted(noCycle, ordering)).toBe(true);
  })
  it('topological sort cycle', () => {
    const graph = new Graph(cycle);
    expect(() => graph.topologicalSort()).toThrow();
  })
})

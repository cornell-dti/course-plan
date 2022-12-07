/** A labelled vertex in a directed graph */
class Vertex<V> {
  private readonly $key: V;

  private readonly $incoming: Vertex<V>[];

  private readonly $outgoing: Vertex<V>[];

  /** The unique key of this vertex */
  get key(): V {
    return this.$key;
  }

  /** Nodes `u` such that there exists an edge `(u, this)` */
  get incoming(): readonly Vertex<V>[] {
    return this.$incoming;
  }

  /** Nodes `v` such that there exists an edge `(this, v)` */
  get outgoing(): readonly Vertex<V>[] {
    return this.$outgoing;
  }

  /** Indegree of this vertex */
  get indegree(): number {
    return this.incoming.length;
  }

  /** Outdegree of this vertex */
  get outdegree(): number {
    return this.outgoing.length;
  }

  /**
   * Construct a new isolated vertex
   * @param key the unique key of the new vertex
   */
  constructor(key: V) {
    this.$key = key;
    this.$incoming = [];
    this.$outgoing = [];
  }

  /**
   * Add an edge from this vertex to another vertex
   * @param dst the destination of this new edge
   */
  addEdge(dst: Vertex<V>) {
    dst.$incoming.push(this);
    this.$outgoing.push(dst);
  }
}

/** A directed graph with unlabeled edges and labeled vertices */
export default class Graph<V extends string | number> {
  private readonly vertices: Map<V, Vertex<V>>;

  /**
   * Construct a graph from a list of edges
   *
   * @param edges an array `[[u1, v1], ..., [un, vn]]` representing the edges of the graph
   */
  constructor(edges: [V, V][]) {
    this.vertices = new Map();
    for (const [u, v] of edges) {
      const src = this.getVertex(u);
      const dst = this.getVertex(v);
      src.addEdge(dst);
    }
  }

  /**
   * Find the vertex associated with a key, or create one if there exists no such vertex
   *
   * @param key the unique key of the vertex
   * @returns the vertex associated with `key`
   */
  private getVertex(key: V): Vertex<V> {
    let vertex = this.vertices.get(key);
    if (!vertex) {
      vertex = new Vertex(key);
      this.vertices.set(key, vertex);
    }
    return vertex;
  }

  /**
   * Perform topological sort on the graph
   *
   * @returns an array of vertex labels that are topologically sorted
   * @throws if this graph has a cycle
   */
  public topologicalSort(): V[] {
    // used to track cycle detection
    const discovered = new Set<V>();
    // nodes that have been processed and put in the output set
    const visited = new Set<V>();
    // reverse-topologically sorted nodes
    const ordered: V[] = [];
    // visit a nodes descendants, then add this node to the output ordering
    const visit = ({ key, outgoing }: Vertex<V>) => {
      // if already processed node, no work to do
      if (visited.has(key)) return;
      // If temporarily marked node, we have a cycle
      if (discovered.has(key)) throw new Error('Graph.topologicalSort: Cycle Detected');
      // temporarily mark node and visit children
      discovered.add(key);
      for (const child of outgoing) {
        visit(child);
      }
      visited.add(key);
      ordered.push(key);
    };
    for (const vertex of this.vertices.values()) {
      visit(vertex);
    }
    return ordered.reverse();
  }
}

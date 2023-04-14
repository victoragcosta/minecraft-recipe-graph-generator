export class GraphError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NodeNotFoundError extends GraphError {
  constructor() {
    super("Node Not Found: the specified node was not found inside the graph.");
  }
}
export class EdgeNotFoundError extends GraphError {
  constructor() {
    super("Edge Not Found: the specified edge was not found inside the graph.");
  }
}
export class InconsistentGraphError extends GraphError {
  constructor(message: string) {
    super(`Inconsistent Graph Error: ${message}`);
  }
}

export class GraphNodeError extends GraphError {
  constructor(message: string) {
    super(message);
  }
}

export class UnconnectedGraphEdgeError extends GraphNodeError {
  constructor() {
    super(`Unconnected Graph Error: graph edge lacks a node`);
  }
}
export class NoEdgeError extends GraphNodeError {
  constructor() {
    super(`No Edge Error: this node doesn't have an edge to this node.`);
  }
}

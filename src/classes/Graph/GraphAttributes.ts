export default class GraphAttributes {
  public data: Record<string,unknown>;

  constructor(data: Record<string,unknown> = {}) {
    this.data = data;
  }
}
export default class GraphAttributes {
  public data: Record<string, unknown>;

  constructor(data: Record<string, unknown> = {}) {
    this.data = data;
  }

  public toGraphMl(): string {
    const attributeXml = (name: string, value: number | boolean | string) =>
      `<data key="${name}">${value}</data>`;

    return Object.entries(this.data)
      .map(([key, value]) => {
        let convertedValue: string | boolean | number;
        switch (typeof value) {
          case "boolean":
          case "string":
          case "number":
            convertedValue = value;
            break;
          case "object":
            convertedValue = JSON.stringify(value);
            break;
          default:
            convertedValue = value.toString();
            break;
        }
        return attributeXml(key, convertedValue);
      })
      .join("\n");
  }
  public toGraphMlDefinition(attributeFor: "edge" | "node"): string[] {
    const attributeXml = (
      name: string,
      type: "double" | "boolean" | "string"
    ) => `<key id="${name}" for="${attributeFor}" attr.name="${name}" attr.type="${type}">
    <default>${
      type === "double" ? "0.0" : type === "boolean" ? "false" : ""
    }</default>
    </key>`;

    return Object.entries(this.data).map(([key, value]) => {
      let type: "double" | "boolean" | "string";
      switch (typeof value) {
        case "boolean":
          type = "boolean";
          break;
        case "number":
          type = "double";
          break;
        case "string":
          type = "string";
          break;
        default:
          type = "string";
          break;
      }
      return attributeXml(key, type);
    });
  }
}

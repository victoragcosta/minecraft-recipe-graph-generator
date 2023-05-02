export function indent(text: string): string {
  return text
    .split("\n")
    .map((s) => `    ${s}`)
    .join("\n");
}

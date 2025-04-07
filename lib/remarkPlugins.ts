import { selectAll } from "unist-util-select";

export function extractDescription() {
  return (tree: any, file: any) => {
    const texts = selectAll("text", tree.children[0]);
    const text = texts
      .map((node: any) => {
        return node.value;
      })
      .join("");
    if (text) {
      const segments = text.split("。");
      if (segments.length >= 2) {
        file.data.description = `${segments[0]}。`.substring(0, 140);
      }
    }
  };
}

import { select, selectAll } from "unist-util-select";

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

export function extractImageUrl() {
  return (tree: any, file: any) => {
    const image = select("image", tree) as any;
    if (image) {
      file.data.imageUrl = image.url;
    }
  };
}

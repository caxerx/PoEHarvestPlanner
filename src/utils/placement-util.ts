import { CellPlacement } from "@/types/CellPlacement";
import { CellColor } from "../types/CellBase";

export function isSeed(p: CellPlacement) {
  return ["1", "2", "3", "4"].includes(`${p.text}`);
}

export function getColor(p: CellColor, color: string | number | null | undefined) {
  if (!color) {
    return p.default;
  }
  if (color == 0 || color == "wild") {
    return p.wild;
  }
  if (color == 1 || color == "vivid") {
    return p.vivid;
  }
  if (color == 2 || color == "primal") {
    return p.primal;
  }
  return p.default;
}

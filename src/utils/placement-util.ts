import { CellPlacement } from "@/types/CellPlacement";

export function isSeed(p: CellPlacement) {
  return ["1", "2", "3", "4"].includes(`${p.text}`);
}

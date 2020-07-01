import gzip from "gzip-js";
import { Base64 } from "js-base64";
import { CellPlacement } from "../types/CellPlacement";
export function getShare(content: CellPlacement[]) {
  return Base64.fromUint8Array(new Uint8Array(gzip.zip(JSON.stringify(content)))).replace(/\//g, "_");
}

export function fromShare(content: string) {
  return JSON.parse(
    String.fromCharCode(...gzip.unzip(Base64.toUint8Array(content.replace(/_/g, "/"))))
  ) as CellPlacement[];
}

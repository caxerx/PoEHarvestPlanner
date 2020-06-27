import gzip from "gzip-js";
import { Base64, Base64_ } from "js-base64";
export function getShare(content: object) {
  return (Base64 as Base64New).fromUint8Array(gzip.zip(JSON.stringify(content))).replace(/\//g, "_");
}

export function fromShare(content: string) {
  return JSON.parse(String.fromCharCode(...gzip.unzip((Base64 as Base64New).toUint8Array(content.replace(/_/g, "/")))));
}

export interface Base64New extends Base64_ {
  fromUint8Array(arr: number[]): string;
  toUint8Array(str: string): number[];
}

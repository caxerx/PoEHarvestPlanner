import gzip from "gzip-js";
import { Base64 } from "js-base64";
export function getShare(content: object) {
  return (Base64 as any).fromUint8Array(gzip.zip(JSON.stringify(content)));
}

export function fromShare(content: string) {
  return JSON.parse(
    String.fromCharCode(
      ...gzip.unzip((Base64 as any).toUint8Array(content) as any)
    )
  );
}

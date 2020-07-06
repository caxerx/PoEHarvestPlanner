export interface CellPlacement {
  x: number | number[];
  y: number | number[];
  color?: number;
  text: "P" | "C" | "S" | "D" | "1" | "2" | "3" | "4" | "H" | "E1" | "E2" | "E3" | "connection";
}
export interface InferenceArea {
  topLeft: number[];
  size: number;
  color?: number;
  backgroundOpacity: number;
  borderOpacity: number;
}

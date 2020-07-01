export interface CellPlacement {
  x: number | number[];
  y: number | number[];
  color: number;
  text: "P" | "C" | "S" | "D" | "1" | "2" | "3" | "4" | "H" | "connection";
}

export interface CellElement extends CellPlacement {
  x: number;
  y: number;
}

export interface CellConnection extends CellPlacement {
  x: number[];
  y: number[];
}

export interface InferenceArea {
  topLeft: number[];
  size: number;
  color?: number;
  backgroundOpacity: number;
  borderOpacity: number;
}

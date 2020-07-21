import { CellPosition } from "./CellBase";
type PlacementEnum = "P" | "C" | "S" | "D" | "1" | "2" | "3" | "4" | "H" | "connection";

export interface CellPlacement {
  x: number | number[];
  y: number | number[];
  color: number;
  text: PlacementEnum;
}

export interface CellElement extends CellPlacement, CellPosition {
  x: number;
  y: number;
}

export interface CellConnection extends CellPlacement {
  x: number[];
  y: number[];
}

export interface CellPlacementRequest {
  color: number;
  text: PlacementEnum;
}

export interface InferenceArea {
  topLeft: number[];
  size: number;
  color?: number;
  backgroundOpacity: number;
  borderOpacity: number;
}

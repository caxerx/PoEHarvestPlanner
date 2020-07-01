export interface PlacementRender {
  cellStyle: CSSStyleDeclaration;
  textStyle: CSSStyleDeclaration;
  text: string;
}

export interface LinePosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LineAttributes extends LinePosition {
  style: string;
  opacity: number;
}

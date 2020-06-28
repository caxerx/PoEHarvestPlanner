import { calculateAreaSize, findAreaTopLeft } from "./cell-calc";

export function calculateAreaPixelSize(area: number[][], size: number) {
  const areaSize = calculateAreaSize(area);
  return [areaSize[0] * size - areaSize[0], areaSize[1] * size - areaSize[1]];
}

export function calculateCellPosition(cell: number[], size: number) {
  return [(cell[0] - 1) * size - cell[0], (cell[1] - 1) * size - cell[1]];
}

export function createCell(cell: number[], size: number, color: string | null) {
  const [xPos, yPos] = calculateCellPosition(cell, size);
  return {
    height: `${size}px`,
    width: `${size}px`,
    top: `${xPos}px`,
    left: `${yPos}px`,
    backgroundColor: color
  } as CSSStyleDeclaration;
}

export function createSelectionCell(cell: number[], size: number) {
  const [xPos, yPos] = calculateCellPosition(cell, size);
  return {
    height: `${size}px`,
    width: `${size}px`,
    top: `${xPos}px`,
    left: `${yPos}px`
  } as CSSStyleDeclaration;
}

export function createSelectionArea(selectionArea: number[][], size: number) {
  const topLeft = findAreaTopLeft(selectionArea);
  const [xPos, yPos] = calculateCellPosition(topLeft, size);
  const [height, width] = calculateAreaPixelSize(selectionArea, size);
  return {
    height: `${height}px`,
    width: `${width}px`,
    top: `${xPos}px`,
    left: `${yPos}px`
  };
}

export function generateCellFromSetting(
  column: number,
  row: number,
  size: number,
  layout: number[][],
  color: (string | null)[]
) {
  const cellStyle: CSSStyleDeclaration[][] = [];
  for (let x = 0; x < column; x++) {
    cellStyle[x] = [];
    for (let y = 0; y < row; y++) {
      cellStyle[x].push(createCell([x + 1, y + 1], size, color[layout[x][y]]));
    }
  }
  return cellStyle;
}

export function generateSelectionCellFromSetting(column: number, row: number, size: number) {
  const cellStyle: CSSStyleDeclaration[][] = [];
  for (let x = 0; x < column; x++) {
    cellStyle[x] = [];
    for (let y = 0; y < row; y++) {
      cellStyle[x].push(createSelectionCell([x + 1, y + 1], size));
    }
  }
  return cellStyle;
}

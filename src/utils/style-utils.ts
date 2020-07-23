import { calculateAreaSize, findAreaTopLeft } from "./cell-calc";
import { CellPlacement, CellConnection, CellElement } from "../types/CellPlacement";
import { PlacementRender, LineAttributes, LinePosition, PlacementMask } from "../types/PlacementRender";

export function calculateAreaPixelSize(area: number[][], size: number) {
  const areaSize = calculateAreaSize(area);
  return [areaSize[0] * size - areaSize[0] + 1, areaSize[1] * size - areaSize[1] + 1];
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

export function createPlacementCell(
  placement: CellPlacement,
  size: number,
  backgroundColor: string[],
  placementOpacity: Record<string, string>
): CSSStyleDeclaration {
  const [xPos, yPos] = calculateCellPosition([+placement.x, +placement.y], size);

  const style = {
    height: `${size}px`,
    width: `${size}px`,
    top: `${xPos}px`,
    left: `${yPos}px`,
    backgroundColor: `rgba(${backgroundColor[placement.color ?? -1]}, ${placementOpacity[placement.text] ?? 0})`,
    opacity: "1"
  } as CSSStyleDeclaration;

  return style;
}

export function createConnectableFilter(placement: CellPlacement, size: number): PlacementMask {
  const [xPos, yPos] = calculateCellPosition([+placement.x, +placement.y], size);

  return {
    height: size,
    width: size,
    x: yPos,
    y: xPos
  };
}

export function createInfluenceArea(
  cell: CellElement,
  color: string,
  areaOpacity: number,
  areaBorderOpacity: number,
  area: number,
  size: number
) {
  const leftTop = calculateCellPosition([cell.x - area, cell.y - area], size);
  const areaSize = calculateAreaPixelSize(
    [
      [cell.x - area, cell.y - area],
      [cell.x + area, cell.y + area]
    ],
    size
  );

  return {
    left: `${leftTop[1]}px`,
    top: `${leftTop[0]}px`,
    width: `${areaSize[0]}px`,
    height: `${areaSize[1]}px`,
    backgroundColor: `rgba(${color}, ${areaOpacity})`,
    border: `2px solid rgba(${color}, ${areaBorderOpacity})`,
    boxShadow: `0px 0px 4px rgba(${color}, ${areaBorderOpacity})`
  } as CSSStyleDeclaration;
}

export function createConnectionPosition(c: CellConnection, size: number): LinePosition {
  const pos1 = calculateCellPosition([c.x[0], c.y[0]], size);
  const pos2 = calculateCellPosition([c.x[1], c.y[1]], size);
  return {
    y1: pos1[0] + size / 2,
    x1: pos1[1] + size / 2,
    y2: pos2[0] + size / 2,
    x2: pos2[1] + size / 2
  };
}

export function createConnection(
  c: CellConnection,
  size: number,
  lineColor: string[],
  connectionAlpha: number,
  isSelecting: boolean,
  backgroundColor?: string
): LineAttributes[] {
  const position = createConnectionPosition(c, size);
  const opacity = isSelecting ? 1 : connectionAlpha;

  return [
    {
      ...position,
      style: `stroke:${backgroundColor ?? `black`}; stroke-width:4`,
      opacity
    },
    {
      ...position,
      style: `stroke:${lineColor[c.color]}; stroke-width:2`,
      opacity
    }
  ];
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

export function generatePlacmenetCellFromSetting(
  placement: CellPlacement[],
  size: number,
  backgroundColor: string[],
  placementOpacity: Record<string, string>
) {
  const cellStyle: PlacementRender[] = [];
  for (let i = 0; i < placement.length; i++) {
    if (placement[i].text == "connection") {
      continue;
    }

    cellStyle.push({
      cellStyle: createPlacementCell(placement[i], size, backgroundColor, placementOpacity),
      textStyle: {} as CSSStyleDeclaration,
      text: placement[i].text
    });
  }
  return cellStyle;
}

export function generateConnectionFromSetting(
  placement: CellConnection[],
  size: number,
  lineColor: string[],
  connectionAlpha: number,
  backgroundColor?: string
) {
  const cellStyle: LineAttributes[] = [];
  for (let i = 0; i < placement.length; i++) {
    cellStyle.push(...createConnection(placement[i], size, lineColor, connectionAlpha, false, backgroundColor));
  }
  return cellStyle;
}

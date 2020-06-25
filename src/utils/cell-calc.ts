export function calculateAreaSize(area: number[][]) {
  let [x1, y1] = area[0];
  let [x2, y2] = area[1];
  if (x1 > x2) {
    [x1, x2] = [x2, x1];
  }
  if (y1 > y2) {
    [y1, y2] = [y2, y1];
  }
  return [x2 - x1 + 1, y2 - y1 + 1];
}

export function calculateAreaPixelSize(area: number[][], size: number) {
  const areaSize = calculateAreaSize(area);
  return [areaSize[0] * size - areaSize[0], areaSize[1] * size - areaSize[1]];
}

export function calculateCellPosition(cell: number[], size: number) {
  return [(cell[0] - 1) * size - cell[0], (cell[1] - 1) * size - cell[1]];
}

export function findAreaTopLeft(area: number[][]) {
  return [
    area[0][0] > area[1][0] ? area[1][0] : area[0][0],
    area[0][1] > area[1][1] ? area[1][1] : area[0][1],
  ];
}

export function generateSelectedCell(area: number[][]) {
  let x0 = area[0][0];
  let x1 = area[1][0];
  let y0 = area[0][1];
  let y1 = area[1][1];
  if (x0 > x1) [x0, x1] = [x1, x0];
  if (y0 > y1) [y0, y1] = [y1, y0];
  const cells = [];
  for (let i = x0; i <= x1; i++) {
    for (let j = y0; j <= y1; j++) {
      cells.push([i, j]);
    }
  }
  return cells;
}

export function calcMoveCell(
  p1: number,
  p2: number,
  move: number,
  cell: number
) {
  if (move > 0) {
    const movedCell = Math.max(p1, p2) + move;
    if (movedCell > cell) {
      return [
        p1 + (move - (movedCell - cell)),
        p2 + (move - (movedCell - cell)),
      ];
    }
    return [p1 + move, p2 + move];
  } else {
    const movedCell = Math.min(p1, p2) + move;
    if (movedCell < 1) {
      return [p1 + movedCell, p2 + movedCell];
    }
    return [p1 + move, p2 + move];
  }
}

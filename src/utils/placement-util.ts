import { CellPlacement } from "@/types/CellPlacement";
import { CellColor, CellPosition } from "../types/CellBase";
import { CellElement } from "../types/CellPlacement";
import { isOutOfRange } from "./cell-calc";

/**
 * @deprecated NO!
 */
export function isSeed(p: CellPlacement) {
  return p == p;
}

export function isConnectable(p: CellPlacement) {
  return !["connection", "1", "2", "3", "4", "E1", "E2", "E3"].includes(`${p.text}`);
}

export function getColor(p: CellColor, color: string | number | null | undefined) {
  if (!color) {
    return p.default;
  }
  if (color == 0 || color == "wild") {
    return p.wild;
  }
  if (color == 1 || color == "vivid") {
    return p.vivid;
  }
  if (color == 2 || color == "primal") {
    return p.primal;
  }
  return p.default;
}

export function findPlacement(placement: CellPlacement[], i: number, j: number): CellElement | null {
  return (placement.find(o => o.x == i && o.y == j) as CellElement) ?? null;
}

export function findPlacementFromConnection(placement: CellPlacement[], connection: CellPlacement) {
  if (
    !connection ||
    connection.text != "connection" ||
    typeof connection.x == "number" ||
    typeof connection.y == "number"
  ) {
    return [];
  }
  return [
    findPlacement(placement, connection.x[0], connection.y[0]) ?? null,
    findPlacement(placement, connection.x[1], connection.y[1]) ?? null
  ];
}

const areaElement = ["P", "C", "D"];

export function isAreaElement(placement: CellPlacement) {
  return areaElement.includes(placement.text) && typeof placement.x == "number" && typeof placement.y == "number";
}

export function findConnectionByPlacement(placement: CellPlacement[], pylon: CellPlacement) {
  if (!pylon) return [];
  return placement.filter(
    p =>
      p.text == "connection" &&
      typeof p.x != "number" &&
      typeof p.y != "number" &&
      ((pylon.x == p.x[0] && pylon.y == p.y[0]) || (pylon.x == p.x[1] && pylon.y == p.y[1]))
  );
}

export function findConnectionByPosition(placement: CellPlacement[], p1: CellPosition, p2: CellPosition) {
  let [x1, x2, y1, y2] = [+p1.x, +p2.x, +p1.y, +p2.y];
  if (x1 > x2) {
    [x1, x2] = [x2, x1];
    [y1, y2] = [y2, y1];
  }
  return placement.find(
    p =>
      p.text == "connection" &&
      typeof p.x != "number" &&
      typeof p.y != "number" &&
      x1 == p.x[0] &&
      x2 == p.x[1] &&
      y1 == p.y[0] &&
      y2 == p.y[1]
  );
}

export function findConnectablePlacement(placement: CellPlacement[], element: CellElement) {
  let foundPlacement = placement
    .filter(p => isConnectable(p))
    .filter(p => p != element)
    .map(p => p as CellElement);

  if (element.text != "P") {
    foundPlacement = foundPlacement.filter(p => p.text == "P");
  }
  foundPlacement = foundPlacement.filter(p => !isOutOfRange([p.x, p.y], [element.x, element.y], 4));
  return foundPlacement;
}

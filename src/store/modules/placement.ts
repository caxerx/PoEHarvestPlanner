import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { CellPlacement, CellConnection, CellPlacementRequest, CellElement } from "../../types/CellPlacement";
import { fromShare } from "../../utils/link-share";
import { generatePlacmenetCellFromSetting, generateConnectionFromSetting } from "../../utils/style-utils";
import { PlacementRender, LineAttributes } from "../../types/PlacementRender";
import { VisualSettings } from "../../types/VisualSettings";
import { generateSelectedCell, isAreaElement } from "../../utils/cell-calc";
import { CellPosition } from "../../types/CellBase";
import { calculateCellPosition, calculateAreaPixelSize } from "../../utils/style-utils";

@Module
export default class Placement extends VuexModule {
  _cellPlacement: CellPlacement[] = [];
  _renderedPlacement: PlacementRender[] = [];
  _renderedConnection: LineAttributes[] = [];
  _renderedInferenceArea: CSSStyleDeclaration[] = [];

  get cellPlacement() {
    return this._cellPlacement;
  }

  get renderedPlacement() {
    return this._renderedPlacement;
  }

  get renderedConnection() {
    return this._renderedConnection;
  }

  get renderedInferenceArea() {
    return this._renderedInferenceArea;
  }

  get areaElementSize(): Record<string, number> {
    return {
      P: 4,
      C: 2,
      D: 2
    };
  }

  @Mutation
  setRenderedInferenceArea(data: CSSStyleDeclaration[]) {
    this._renderedInferenceArea = data;
  }

  @Mutation
  setCellPlacement(data: CellPlacement[]) {
    this._cellPlacement = data;
  }

  @Mutation
  insertCellPlacement(data: CellPlacement) {
    this._cellPlacement.push(data);
  }

  @Mutation
  setRenderedPlacement(data: PlacementRender[]) {
    this._renderedPlacement = data;
  }

  @Mutation
  setRenderedConnection(data: LineAttributes[]) {
    this._renderedConnection = data;
  }

  @Mutation
  removeCellPlacement(index: number) {
    this._cellPlacement.splice(index, 1);
  }

  @Action
  deleteCellElementByPosition(data: CellPosition) {
    const index = this._cellPlacement.findIndex(p => p.x == data.x && p.y == data.y);
    if (index > -1) {
      this.context.commit("removeCellPlacement", index);
    }
  }

  @Action
  addCellElement(placement: CellPlacementRequest) {
    if (this.context.getters.hasSelectionArea) {
      generateSelectedCell(this.context.getters.selectionArea).forEach(cell => {
        this.context.dispatch("deleteCellElementByPosition", { x: cell[0], y: cell[1] });
        this.context.commit("insertCellPlacement", {
          ...placement,
          x: cell[0],
          y: cell[1]
        } as CellPlacement);
      });
    }
  }

  @Action
  setPlacementFromShare(shareData: string) {
    const placement = fromShare(shareData);
    this.context.commit("setCellPlacement", placement);
    this.context.dispatch("regeneratePlacement");
  }

  @Action
  regenerateArea() {
    let filteredPlacement = this._cellPlacement.filter(f => isAreaElement(f));

    // filteredPlacement = filteredPlacement.filter(
    //   f =>
    //     typeof this.context.getters.settings.linkFilter != "number" ||
    //     f.color == this.context.getters.settings.linkFilter
    // );

    filteredPlacement = filteredPlacement.filter(f => this.context.getters.alwaysShowBorder[f.text]);

    this.context.commit(
      "setRenderedInferenceArea",
      filteredPlacement
        .map(f => f as CellElement)
        .map(cell => {
          const size = this.context.getters.areaElementSize[cell.text];
          const leftTop = calculateCellPosition([cell.x - size, cell.y - size], this.context.getters.size);
          const areaSize = calculateAreaPixelSize(
            [
              [cell.x - size, cell.y - size],
              [cell.x + size, cell.y + size]
            ],
            this.context.getters.size
          );
          const areaOpacity = this.context.getters.areaOpacity;
          const areaBorderOpacity = this.context.getters.areaBorderOpacity;
          return {
            left: `${leftTop[1]}px`,
            top: `${leftTop[0]}px`,
            width: `${areaSize[0]}px`,
            height: `${areaSize[1]}px`,
            backgroundColor: `rgba(${this.context.getters.placementColor[cell.color]}, ${areaOpacity[cell.text]})`,
            border: `2px solid rgba(${this.context.getters.placementColor[cell.color]}, ${
              areaBorderOpacity[cell.text]
            })`,
            boxShadow: `0px 0px 4px rgba(${this.context.getters.placementColor[cell.color]}, ${
              areaBorderOpacity[cell.text]
            })`
          } as CSSStyleDeclaration;
        })
    );
  }

  @Action
  regeneratePlacement() {
    const placement = this._cellPlacement;

    // Placement

    this.context.commit(
      "setRenderedPlacement",
      generatePlacmenetCellFromSetting(
        placement,
        this.context.getters.size,
        this.context.getters.placementColor,
        this.context.getters.placementOpacity
      )
    );

    // Connection

    const settings = this.context.getters.settings as VisualSettings;

    let connection = placement.filter(p => p.text == "connection");
    if (settings.alwaysShowLink && typeof settings.linkFilter == "number") {
      connection = connection.filter(p => p.color == settings.linkFilter);
    }

    this.context.commit(
      "setRenderedConnection",
      generateConnectionFromSetting(
        connection as CellConnection[],
        this.context.getters.size,
        this.context.getters.connectionColor,
        settings.linkOpacity / 100
      )
    );

    this.context.dispatch("regenerateArea");
  }
}

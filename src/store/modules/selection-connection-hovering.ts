import Vue from "vue";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { CellPosition } from "../../types/CellBase";
import {
  createSelectionArea,
  createInfluenceArea,
  generateConnectionFromSetting,
  generatePlacmenetCellFromSetting
} from "../../utils/style-utils";
import {
  findPlacement,
  isAreaElement,
  findConnectionByPlacement,
  findPlacementFromConnection,
  findConnectablePlacement
} from "../../utils/placement-util";
import { CellElement, CellConnection, CellPlacement } from "../../types/CellPlacement";
import { LineAttributes, PlacementRender, PlacementMask } from "../../types/PlacementRender";
import { createConnection, createConnectableFilter } from "../../utils/style-utils";
import { findPlacementInArea } from "../../utils/placement-util";

@Module
export default class SelectionConnectingHovering extends VuexModule {
  _isDragging = false;
  _isConnecting = false;
  _isConnectingWithCtrl = false;

  _selectionArea = [
    [-1, -1],
    [-1, -1]
  ];

  _connectingPoint = [
    [-1, -1],
    [-1, -1]
  ];

  _hoveringCell = [-1, -1];

  _selectedPlacement: CellPlacement[] = [];

  _renderedConnectablePlacement: PlacementMask[] = [];

  _renderedSelectionArea: CSSStyleDeclaration | null = null;
  _renderedConnectingConnection: LineAttributes[] = [];

  _renderedHoveringInfluenceArea: CSSStyleDeclaration | null = null;
  _renderedHoveringConnection: LineAttributes[] = [];
  _renderedHoveringPlacement: PlacementRender[] = [];

  _renderedSelectingInfluenceArea: CSSStyleDeclaration | null = null;
  _renderedSelectingConnection: LineAttributes[] = [];
  _renderedSelectingPlacement: PlacementRender[] = [];

  get selectionArea() {
    return this._selectionArea;
  }

  get isSingleSelection() {
    return (
      this.hasSelectionArea &&
      this._selectionArea[0][0] == this._selectionArea[1][0] &&
      this._selectionArea[0][1] == this._selectionArea[1][1]
    );
  }

  get hasSelectionArea() {
    return this._selectionArea[0][0] != -1;
  }

  get isDragging() {
    return this._isDragging;
  }

  get isConnecting() {
    return this._isConnecting;
  }

  get isConnectingWithCtrl() {
    return this._isConnectingWithCtrl;
  }

  get renderedConnectablePlacement() {
    return this._renderedConnectablePlacement;
  }

  get renderedSelectionArea() {
    return this._renderedSelectionArea;
  }

  get renderedConnectingConnection() {
    return this._renderedConnectingConnection;
  }

  get renderedHoveringInfluenceArea() {
    return this._renderedHoveringInfluenceArea;
  }

  get renderedSelectingInfluenceArea() {
    return this._renderedSelectingInfluenceArea;
  }

  get renderedHoveringConnection() {
    return this._renderedHoveringConnection;
  }

  get renderedSelectingConnection() {
    return this._renderedSelectingConnection;
  }

  get renderedHoveringPlacement() {
    return this._renderedHoveringPlacement;
  }

  get renderedSelectingPlacement() {
    return this._renderedSelectingPlacement;
  }

  get hoveringCell() {
    if (this._hoveringCell[0] == -1) return null;
    return this._hoveringCell;
  }

  get selectedPlacement() {
    return this._selectedPlacement;
  }

  @Mutation
  setHoveringCell(position: CellPosition) {
    this._hoveringCell = [position.x, position.y];
  }

  @Mutation
  setRenderedConnectablePlacement(placement: PlacementMask[]) {
    this._renderedConnectablePlacement = placement;
  }

  @Mutation
  setSelectionInitialPoint(position: CellPosition) {
    Vue.set(this._selectionArea, 0, [position.x, position.y]);
  }
  @Mutation
  setSelectionSecondPoint(position: CellPosition) {
    Vue.set(this._selectionArea, 1, [position.x, position.y]);
  }

  @Mutation
  setConnectionInitialPoint(position: CellPosition) {
    Vue.set(this._connectingPoint, 0, [position.x, position.y]);
  }

  @Mutation
  setConnectionSecondPoint(position: CellPosition) {
    Vue.set(this._connectingPoint, 1, [position.x, position.y]);
  }

  @Mutation
  setDragging(dragging: boolean) {
    this._isDragging = dragging;
  }

  @Mutation
  setConnecting(connecting: boolean) {
    this._isConnecting = connecting;
  }

  @Mutation
  setConnectingWithCtrl(connecting: boolean) {
    this._isConnectingWithCtrl = connecting;
  }

  @Mutation
  setRenderedSelectionArea(renderedArea: CSSStyleDeclaration | null) {
    this._renderedSelectionArea = renderedArea;
  }

  @Mutation
  setRenderedConnectingConnection(renderedLine: LineAttributes[]) {
    this._renderedConnectingConnection = renderedLine;
  }

  @Mutation
  setRenderedHoveringInfluenceArea(renderedArea: CSSStyleDeclaration | null) {
    this._renderedHoveringInfluenceArea = renderedArea;
  }

  @Mutation
  setRenderedSelectingInfluenceArea(renderedArea: CSSStyleDeclaration | null) {
    this._renderedSelectingInfluenceArea = renderedArea;
  }

  @Mutation
  setRenderedHoveringConnection(renderedLine: LineAttributes[]) {
    this._renderedHoveringConnection = renderedLine;
  }

  @Mutation
  setRenderedSelectingConnection(renderedLine: LineAttributes[]) {
    this._renderedSelectingConnection = renderedLine;
  }

  @Mutation
  setRenderedHoveringPlacement(renderedPlacement: PlacementRender[]) {
    this._renderedHoveringPlacement = renderedPlacement;
  }

  @Mutation
  setRenderedSelectingPlacement(renderedPlacement: PlacementRender[]) {
    this._renderedSelectingPlacement = renderedPlacement;
  }
  @Mutation
  setSelectedPlacement(selectedPlacement: CellPlacement[]) {
    this._selectedPlacement = selectedPlacement;
  }

  @Action
  updateConnecting(connecting: boolean) {
    this.context.commit("setConnecting", connecting);
    if (connecting) {
      const placement = this.context.getters.cellPlacement;
      const foundPlacement = findPlacement(placement, this._connectingPoint[0][0], this._connectingPoint[0][1]);
      if (foundPlacement) {
        this.context.commit(
          "setRenderedConnectablePlacement",
          findConnectablePlacement(placement, foundPlacement).map(p =>
            createConnectableFilter(p, this.context.getters.size)
          )
        );
      }
    } else {
      this.context.commit("setRenderedConnectingConnection", []);
      this.context.commit("setRenderedConnectablePlacement", []);
    }
  }

  @Action
  updateSelectionElement(state: string) {
    if (!(state == "Selecting" || state == "Hovering")) {
      return;
    }

    let targetPlacement = null;

    if (state == "Selecting" && this.isSingleSelection) {
      targetPlacement = findPlacement(
        this.context.getters.cellPlacement,
        this._selectionArea[0][0],
        this._selectionArea[0][1]
      );
    }

    if (state == "Hovering" && this.hoveringCell) {
      targetPlacement = findPlacement(this.context.getters.cellPlacement, this.hoveringCell[0], this.hoveringCell[1]);
    }

    if (!targetPlacement) {
      this.context.commit(`setRendered${state}InfluenceArea`, null);
      this.context.commit(`setRendered${state}Connection`, []);
      this.context.commit(`setRendered${state}Placement`, []);
      return;
    }

    if (isAreaElement(targetPlacement)) {
      //Influence Area
      const size = this.context.getters.size;
      const placementColor = this.context.getters.placementColor;
      const areaOpacity = this.context.getters.areaOpacity;
      const areaBorderOpacity = this.context.getters.areaBorderOpacity;
      const areaElementSize = this.context.getters.areaElementSize;

      this.context.commit(
        `setRendered${state}InfluenceArea`,
        createInfluenceArea(
          targetPlacement as CellElement,
          placementColor[targetPlacement.color],
          areaOpacity[targetPlacement.text],
          areaBorderOpacity[targetPlacement.text],
          areaElementSize[targetPlacement.text],
          size
        )
      );
    } else {
      this.context.commit(`setRendered${state}InfluenceArea`, null);
    }

    //Connection
    const connections = findConnectionByPlacement(this.context.getters.cellPlacement, targetPlacement);
    this.context.commit(
      `setRendered${state}Connection`,
      generateConnectionFromSetting(
        connections as CellConnection[],
        this.context.getters.size,
        this.context.getters.connectionColor,
        1,
        state == "Selecting" ? "red" : "grey"
      )
    );

    //Placement
    const placement = [
      ...new Set([
        ...connections
          .map(c => findPlacementFromConnection(this.context.getters.cellPlacement, c))
          .flat()
          .filter(c => c != null)
          .map(c => c as CellPlacement)
      ])
    ];

    this.context.commit(
      `setRendered${state}Placement`,
      generatePlacmenetCellFromSetting(placement, this.context.getters.size, this.context.getters.placementColor, {})
    );
  }

  @Action
  updateConnectionSecondPoint(position: CellPosition) {
    this.context.commit("setConnectionSecondPoint", position);
    this.context.commit(
      "setRenderedConnectingConnection",
      createConnection(
        {
          x: [this._connectingPoint[0][0], this._connectingPoint[1][0]],
          y: [this._connectingPoint[0][1], this._connectingPoint[1][1]],
          color: 0,
          text: "connection"
        },
        this.context.getters.size,
        ["red"],
        1,
        true
      )
    );
  }

  @Action
  updateSelectionSecondPoint(position: CellPosition) {
    this.context.commit("setSelectionSecondPoint", position);
    this.context.dispatch("generateSelectionArea");
    this.context.dispatch("updateSelectionElement", "Selecting");
  }

  @Action({ commit: "setRenderedSelectionArea" })
  generateSelectionArea() {
    if (this._selectionArea[0][0] == -1) {
      return null;
    }
    return createSelectionArea(this._selectionArea, this.context.getters.size);
  }

  @Action
  cellHovered(position: CellPosition) {
    this.context.commit("setHoveringCell", position);
    this.context.dispatch("updateSelectionElement", "Hovering");
    if (this._isDragging) {
      this.context.dispatch("updateSelectionSecondPoint", position);
    }
    if (this._isConnecting && !this._isConnectingWithCtrl) {
      this.context.dispatch("updateConnectionSecondPoint", position);
    }
  }

  @Action
  cellLeaved() {
    this.context.commit("setHoveringCell", [-1, -1]);
  }

  @Action
  cellLeftDown() {
    if (this._isConnecting) {
      return;
    }
    this.context.commit("setDragging", true);
    this.context.commit("setSelectionInitialPoint", { x: this._hoveringCell[0], y: this._hoveringCell[1] });
    this.context.dispatch("updateSelectionSecondPoint", { x: this._hoveringCell[0], y: this._hoveringCell[1] });
    this.context.dispatch("generateSelectionArea");
  }

  @Action({ commit: "setSelectedPlacement" })
  updateSelectedPlacement() {
    if (this.hasSelectionArea) {
      return findPlacementInArea(
        this.context.getters.cellPlacement,
        {
          x: this._selectionArea[0][0],
          y: this._selectionArea[0][1]
        },
        {
          x: this._selectionArea[1][0],
          y: this._selectionArea[1][1]
        }
      );
    }
    return [];
  }

  @Action
  cellLeftUp() {
    this.context.commit("setDragging", false);
    this.context.dispatch("updateSelectedPlacement");
  }

  @Action
  cellRightDown() {
    if (this._isDragging) {
      return;
    }
    this.context.commit("setConnectionInitialPoint", { x: this._hoveringCell[0], y: this._hoveringCell[1] });
    this.context.commit("setSelectionInitialPoint", { x: this._hoveringCell[0], y: this._hoveringCell[1] });
    this.context.dispatch("updateSelectionSecondPoint", { x: this._hoveringCell[0], y: this._hoveringCell[1] });
    this.context.dispatch("updateConnecting", true);
  }

  @Action
  cellRightUp() {
    this.context.dispatch("updateConnecting", false);
  }

  @Action
  cellCtrlRightClicked() {
    //
  }

  @Action
  keyboardEscPressed() {
    this.context.commit("setDragging", false);
    this.context.commit("setSelectionInitialPoint", { x: -1, y: -1 });
    this.context.dispatch("updateSelectionSecondPoint", { x: -1, y: -1 });
  }

  @Action
  keyboardCtrlAPressed() {
    this.context.commit("setSelectionInitialPoint", { x: 1, y: 1 });
    this.context.dispatch("updateSelectionSecondPoint", {
      x: this.context.getters.column,
      y: this.context.getters.row
    });
  }

  @Action
  keyboardCtrlDown() {
    if (this._isConnecting || this._isDragging || !this.isSingleSelection) {
      return;
    }
    this.context.commit("setConnectionInitialPoint", { x: this._selectionArea[0][0], y: this._selectionArea[0][1] });
    this.context.commit("setConnectingWithCtrl", true);
    this.context.dispatch("updateConnecting", true);
  }

  @Action
  keyboardCtrlUp() {
    if (this._isConnectingWithCtrl) {
      this.context.dispatch("updateConnecting", false);
      this.context.commit("setConnectingWithCtrl", false);
    }
  }
}

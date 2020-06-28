import Vue from "vue";
import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { CellPosition } from "../../types/CellBase";
import { createSelectionArea } from "../../utils/style-utils";

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

  _renderedSelectionArea: CSSStyleDeclaration | null = null;

  get isDragging() {
    return this._isDragging;
  }

  get isConnecting() {
    return this._isConnecting;
  }

  get renderedSelectionArea() {
    return this._renderedSelectionArea;
  }

  @Mutation
  setHoveringCell(position: CellPosition) {
    this._hoveringCell = [position.x, position.y];
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
  setRenderedSelectionArea(renderedArea: CSSStyleDeclaration | null) {
    this._renderedSelectionArea = renderedArea;
  }

  @Action
  updateConnectionSecondPoint(position: CellPosition) {
    this.context.commit("setConnectionSecondPoint", position);
  }

  @Action
  updateSelectionSecondPoint(position: CellPosition) {
    this.context.commit("setSelectionSecondPoint", position);
    this.context.dispatch("generateSelectionArea");
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
    if (this._isDragging) {
      this.context.dispatch("updateSelectionSecondPoint", position);
    }
    if (this._isConnecting) {
      this.context.commit("setConnectionSecondPoint", position);
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

  @Action
  cellLeftUp() {
    this.context.commit("setDragging", false);
  }

  @Action
  cellRightDown() {
    if (!this._isDragging) {
      return;
    }
    this.context.commit("setConnecting", true);
    this.context.commit("setConnectionInitialPoint", { x: this._hoveringCell[0], y: this._hoveringCell[1] });
  }

  @Action
  cellRightUp() {
    this.context.commit("setConnecting", false);
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
}

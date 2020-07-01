import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { CellPlacement, CellConnection } from "../../types/CellPlacement";
import { fromShare } from "../../utils/link-share";
import { generatePlacmenetCellFromSetting, generateConnectionFromSetting } from "../../utils/style-utils";
import { PlacementRender, LineAttributes } from "../../types/PlacementRender";
import { VisualSettings } from "../../types/VisualSettings";

@Module
export default class Placement extends VuexModule {
  _cellPlacement: CellPlacement[] = [];
  _renderedPlacement: PlacementRender[] = [];
  _renderedConnection: LineAttributes[] = [];

  get cellPlacement() {
    return this._cellPlacement;
  }

  get renderedPlacement() {
    return this._renderedPlacement;
  }

  get renderedConnection() {
    return this._renderedConnection;
  }

  @Mutation
  setCellPlacement(data: CellPlacement[]) {
    this._cellPlacement = data;
  }

  @Mutation
  setRenderedPlacement(data: PlacementRender[]) {
    this._renderedPlacement = data;
  }

  @Mutation
  setRenderedConnection(data: LineAttributes[]) {
    this._renderedConnection = data;
  }

  @Action
  setPlacementFromShare(shareData: string) {
    const placement = fromShare(shareData);
    this.context.commit("setCellPlacement", placement);
    this.context.dispatch("regeneratePlacement");
  }

  @Action
  regeneratePlacement() {
    const placement = this._cellPlacement;

    this.context.commit(
      "setRenderedPlacement",
      generatePlacmenetCellFromSetting(
        placement,
        this.context.getters.size,
        this.context.getters.placementColor,
        this.context.getters.placementOpacity
      )
    );

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
  }
}

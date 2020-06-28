import Vue from "vue";
import Vuex from "vuex";
import Settings from "./modules/settings";
import CellBase from "./modules/cell-base";
import SelectionConnectingHovering from "./modules/selection-connection-hovering";
import Placement from "./modules/placement";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    settings: Settings,
    cellBase: CellBase,
    selectionConnectingHovering: SelectionConnectingHovering,
    placement: Placement
  }
});

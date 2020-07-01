import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import Settings from "./modules/settings";
import CellBase from "./modules/cell-base";
import SelectionConnectingHovering from "./modules/selection-connection-hovering";
import Placement from "./modules/placement";

Vue.use(Vuex);

const persistedPlugin = createPersistedState({
  key: "settings",
  paths: ["settings._settings"]
});

const store = new Vuex.Store({
  modules: {
    settings: Settings,
    cellBase: CellBase,
    selectionConnectingHovering: SelectionConnectingHovering,
    placement: Placement
  },
  plugins: [persistedPlugin]
});

export default store;

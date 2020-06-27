import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const storedSettings = {
  linkOpacity: 50,
  areaOpacity: 10,
  placementOpacity: 70,
  linkFilter: null,
  alwaysShowPylonLink: false,
  alwaysShowPylonArea: false,
  alwaysShowCollectorArea: false,
  alwaysShowDisperserArea: false,
  ...JSON.parse(localStorage.getItem("settings") || "{}")
};

export default new Vuex.Store({
  state: {
    settings: storedSettings
  },
  mutations: {
    setSetting(state, payload) {
      state.settings = payload;
      localStorage.setItem("settings", JSON.stringify(payload));
    }
  },
  getters: {
    settings(state) {
      return state.settings;
    }
  }
});

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { VisualSettings, SettingChangeRequest } from "../../types/VisualSettings";
import Vue from "vue";
import store from "../";

@Module
export default class Settings extends VuexModule {
  _settings: VisualSettings = new VisualSettings();

  @Mutation
  setSetting(setting: VisualSettings) {
    this._settings = setting;
  }

  @Mutation
  setSettingValue(req: SettingChangeRequest) {
    if (req.area) {
      Reflect.set(Reflect.get(this._settings, req.area), req.key, req.value);
      return;
    }
    Reflect.set(this._settings, req.key, req.value);
  }

  @Action
  updateSetting(req: SettingChangeRequest) {
    this.context.commit("setSettingValue", req);
    this.context.dispatch("regeneratePlacement");
  }

  @Action({ commit: "setGreyscale" })
  changeGreyscale(greyscale: boolean) {
    this.context.dispatch("regenerateCellStyle", greyscale);
    return greyscale;
  }

  @Mutation
  setGreyscale(greyscale: boolean) {
    this._settings.greyscaleTerrain = greyscale;
  }

  @Action({ commit: "setSetting" })
  resetSetting() {
    return new VisualSettings();
  }

  get settings(): VisualSettings {
    return this._settings;
  }

  get placementOpacity(): Record<string, number> {
    return {
      P: this._settings.pylon.placementOpacity / 100,
      D: this._settings.disperser.placementOpacity / 100,
      C: this._settings.collector.placementOpacity / 100,
      S: this._settings.storageOpacity / 100,
      H: this._settings.horticraftingStationOpacity / 100,
      "1": this._settings.tier1SeedOpacity / 100,
      "2": this._settings.tier2SeedOpacity / 100,
      "3": this._settings.tier3SeedOpacity / 100,
      "4": this._settings.tier4SeedOpacity / 100
    };
  }
}

Vue.nextTick().then(() => {
  store.dispatch("regenerateCellStyle", (store.getters.settings as VisualSettings).greyscaleTerrain);
});

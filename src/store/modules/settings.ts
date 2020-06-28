import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { VisualSettings, SettingChangeRequest } from "../../types/VisualSettings";

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
}

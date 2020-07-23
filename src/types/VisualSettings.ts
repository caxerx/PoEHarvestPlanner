export class AreaElementVisualSetting {
  alwaysShowArea = false;
  areaBorderOpacity = 30;
  areaBackgroundOpacity = 10;
  placementOpacity = 60;
}

export class VisualSettings {
  rotate = true;
  linkFilter: number | null = null;
  linkOpacity = 70;
  greyscaleTerrain = false;
  alwaysShowLink = true;
  tier1SeedOpacity = 20;
  tier2SeedOpacity = 20;
  tier3SeedOpacity = 40;
  tier4SeedOpacity = 60;
  storageOpacity = 60;
  horticraftingStationOpacity = 60;
  pylon = new AreaElementVisualSetting();
  collector: AreaElementVisualSetting = { ...new AreaElementVisualSetting(), alwaysShowArea: true };
  disperser = new AreaElementVisualSetting();
}

export interface SettingChangeRequest {
  area: string | null;
  key: string;
  value: number | boolean | null;
}

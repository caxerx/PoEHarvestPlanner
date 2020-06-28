<template>
  <v-card>
    <v-card-title>
      Settings
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon @click="resetSetting" v-bind="attrs" v-on="on"><v-icon>mdi-autorenew</v-icon></v-btn>
        </template>
        <span>Reset Setting</span>
      </v-tooltip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="pa-0">
      <div class="px-5">
        <v-row class="pt-3 pl-3">
          <strong class="title">General</strong>
        </v-row>
        <v-row>
          <v-col>
            <v-switch
              label="Greyscale Terrain"
              :input-value="settings.greyscaleTerrain"
              hide-details
              @change="setGreyscale($event)"
            ></v-switch>
          </v-col>
          <v-col>
            <v-switch
              label="Always Show Connection"
              :input-value="settings.alwaysShowLink"
              hide-details
              @change="setSetting(null, 'alwaysShowLink', $event)"
            ></v-switch> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Connection Line Opacity: ${settings.linkOpacity}%`"
              :value="settings.linkOpacity"
              persistent-hint
              @input="setSetting(null, 'linkOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
      </div>
      <v-divider></v-divider>

      <div class="px-5">
        <v-row class="pt-3 pl-3">
          <strong class="title">Pylon</strong>
        </v-row>
        <v-row>
          <v-col>
            <v-switch
              label="Always Show Pylon Area"
              :input-value="settings.pylon.alwaysShowArea"
              hide-details
              @change="setSetting('pylon', 'alwaysShowArea', $event)"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Area Border Opacity: ${settings.pylon.areaBorderOpacity}%`"
              :value="settings.pylon.areaBorderOpacity"
              persistent-hint
              @input="setSetting('pylon', 'areaBorderOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Area Background Opacity: ${settings.pylon.areaBackgroundOpacity}%`"
              :value="settings.pylon.areaBackgroundOpacity"
              persistent-hint
              @input="setSetting('pylon', 'areaBackgroundOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Element Opacity: ${settings.pylon.placementOpacity}%`"
              :value="settings.pylon.placementOpacity"
              persistent-hint
              @input="setSetting('pylon', 'placementOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
      </div>

      <v-divider></v-divider>

      <div class="px-5">
        <v-row class="pt-3 pl-3">
          <strong class="title">Collector</strong>
        </v-row>
        <v-row>
          <v-col>
            <v-switch
              label="Always Show Collector Area"
              :input-value="settings.collector.alwaysShowArea"
              hide-details
              @change="setSetting('collector', 'alwaysShowArea', $event)"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Area Border Opacity: ${settings.collector.areaBorderOpacity}%`"
              :value="settings.collector.areaBorderOpacity"
              persistent-hint
              @input="setSetting('collector', 'areaBorderOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Area Background Opacity: ${settings.collector.areaBackgroundOpacity}%`"
              :value="settings.collector.areaBackgroundOpacity"
              persistent-hint
              @input="setSetting('collector', 'areaBackgroundOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Element Opacity: ${settings.collector.placementOpacity}%`"
              :value="settings.collector.placementOpacity"
              persistent-hint
              @input="setSetting('collector', 'placementOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
      </div>
      <v-divider></v-divider>
      <div class="px-5">
        <v-row class="pt-3 pl-3">
          <strong class="title">Disperser</strong>
        </v-row>
        <v-row>
          <v-col>
            <v-switch
              label="Always Show Disperser Area"
              :input-value="settings.disperser.alwaysShowArea"
              hide-details
              @change="setSetting('disperser', 'alwaysShowArea', $event)"
            ></v-switch> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Area Border Opacity: ${settings.disperser.areaBorderOpacity}%`"
              :value="settings.disperser.areaBorderOpacity"
              persistent-hint
              @input="setSetting('disperser', 'areaBorderOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Area Background Opacity: ${settings.disperser.areaBackgroundOpacity}%`"
              :value="settings.disperser.areaBackgroundOpacity"
              persistent-hint
              @input="setSetting('disperser', 'areaBackgroundOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Element Opacity: ${settings.disperser.placementOpacity}%`"
              :value="settings.disperser.placementOpacity"
              persistent-hint
              @input="setSetting('disperser', 'placementOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
      </div>
      <v-divider></v-divider>
      <div class="px-5">
        <v-row class="pt-3 pl-3">
          <strong class="title">Other Element</strong>
        </v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Tier 1 Seed Opacity ${settings.tier1SeedOpacity}%`"
              persistent-hint
              :value="settings.tier1SeedOpacity"
              @input="setSetting(null, 'tier1SeedOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Tier 2 Seed Opacity ${settings.tier2SeedOpacity}%`"
              :value="settings.tier2SeedOpacity"
              persistent-hint
              @input="setSetting(null, 'tier2SeedOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Tier 3 Seed Opacity ${settings.tier3SeedOpacity}%`"
              :value="settings.tier3SeedOpacity"
              persistent-hint
              @input="setSetting(null, 'tier3SeedOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Tier 4 Seed Opacity ${settings.tier4SeedOpacity}%`"
              :value="settings.tier4SeedOpacity"
              persistent-hint
              @input="setSetting(null, 'tier4SeedOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Storage Opacity: ${settings.storageOpacity}%`"
              :value="settings.storageOpacity"
              persistent-hint
              @input="setSetting(null, 'storageOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
        <v-row>
          <v-col>
            <v-slider
              dense
              :hint="`Horticrafting Station Opacity: ${settings.horticraftingStationOpacity}`"
              :value="settings.horticraftingStationOpacity"
              persistent-hint
              @input="setSetting(null, 'horticraftingStationOpacity', $event)"
            ></v-slider> </v-col
        ></v-row>
      </div>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import { VisualSettings } from "../types/VisualSettings";

export default Vue.extend({
  name: "SettingPanel",
  computed: {
    settings(): VisualSettings {
      return this.$store.getters.settings;
    }
  },
  methods: {
    setGreyscale(greyscale: boolean) {
      this.$store.dispatch("changeGreyscale", greyscale);
    },
    setSetting(area: string | null, key: string, value: boolean | number) {
      this.$store.commit("setSettingValue", {
        area,
        key,
        value
      });
    },
    resetSetting() {
      this.$store.dispatch("resetSetting");
    }
  }
});
</script>

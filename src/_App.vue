<template>
  <v-app>
    <v-app-bar app clipped>
      <v-btn @click="showImportDialog">
        <v-icon>
          mdi-import
        </v-icon>
        Import
      </v-btn>

      <v-btn @click="showExportDialog">
        <v-icon>
          mdi-export
        </v-icon>
        Export
      </v-btn>

      <v-btn @click="undo">
        <v-icon>
          mdi-undo
        </v-icon>
        Undo
      </v-btn>
      <v-btn @click="redo">
        <v-icon>
          mdi-redo
        </v-icon>
        Redo
      </v-btn>
      <v-spacer />
      <v-btn icon @click="githubRepo"><v-icon>mdi-github-circle</v-icon></v-btn>
    </v-app-bar>

    <v-dialog v-model="isShowExportDialog">
      <v-card>
        <v-card-title>
          Export Layout
        </v-card-title>
        <v-card-text>
          <v-textarea
            outlined
            hide-details
            v-model="layoutText"
            readonly
          ></v-textarea>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isShowImportDialog">
      <v-card>
        <v-card-title>
          Export Layout
        </v-card-title>
        <v-card-text>
          <v-textarea outlined hide-details v-model="layoutText"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="importLayout">Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-main style="padding-left:20px; padding-top:90px">
      <v-row>
        <v-col>
          <GridView
            @selectedStyle="selectedStyleChange"
            @placementStyle="placementStyleChange"
            @collectorRange="collectorRangeChange"
            @hoveringRange="hoveringRangeChange"
            ref="grid"
          />
          <div class="selected-cell-range" :style="selectedCellStyle"></div>
          <div
            v-for="(i, index) in placementCellStyle"
            class="cell-placement"
            :style="i"
            :key="`placement-${index}`"
          >
            <div>
              {{ i._text }}
            </div>
          </div>
          <div
            v-for="(i, index) in collectorRangeStyle"
            :class="`collector-range seed-${i._seed}`"
            :style="i"
            :key="`collector-${index}`"
          ></div>
          <div
            v-if="hoveringCellStyle"
            class="hovering-range"
            :style="hoveringCellStyle"
          ></div>
          <!-- <svg
            width="798px"
            height="798px"
            style="position:absolute; top:0; left:0;z-index:5;pointer-events: none;"
          >
            <line
              x1="0"
              y1="0"
              x2="200"
              y2="200"
              style="stroke:rgb(255,0,0);stroke-width:2"
            />
          </svg> -->
        </v-col>
        <v-col> </v-col>
      </v-row>
    </v-main>
    <v-navigation-drawer app right permanent>
      <v-list>
        <v-list-group active-class="list-active" sub-group>
          <template v-slot:activator>
            <v-list-item-title>Pylon</v-list-item-title>
          </template>
          <v-list-item @click="setPlacement('P', 0)">
            <v-list-item-title class="purple--text text--lighten-2">
              Wild Pylon
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setPlacement('P', 1)">
            <v-list-item-title class="yellow--text text--darken-4">
              Vivid Pylon
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setPlacement('P', 2)">
            <v-list-item-title class="blue--text">
              Primal Pylon
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group active-class="list-active" sub-group>
          <template v-slot:activator>
            <v-list-item-title>Collector</v-list-item-title>
          </template>
          <v-list-item @click="setPlacement('C', 0)">
            <v-list-item-title class="purple--text text--lighten-2">
              Wild Collector
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setPlacement('C', 1)">
            <v-list-item-title class="yellow--text text--darken-4">
              Vivid Collector
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setPlacement('C', 2)">
            <v-list-item-title class="blue--text">
              Primal Collector
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group active-class="list-active" sub-group>
          <template v-slot:activator>
            <v-list-item-title>Storage</v-list-item-title>
          </template>
          <v-list-item @click="setPlacement('S', 0)">
            <v-list-item-title class="purple--text text--lighten-2">
              Wild Storage
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setPlacement('S', 1)">
            <v-list-item-title class="yellow--text text--darken-4">
              Vivid Storage
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setPlacement('S', 2)">
            <v-list-item-title class="blue--text">
              Primal Storage
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group active-class="list-active" sub-group>
          <template v-slot:activator>
            <v-list-item-title>Disperser</v-list-item-title>
          </template>
          <v-list-item @click="setPlacement('D', 0)">
            <v-list-item-title class="purple--text text--lighten-2">
              Wild Disperser
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setPlacement('D', 1)">
            <v-list-item-title class="yellow--text text--darken-4">
              Vivid Disperser
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="setPlacement('D', 2)">
            <v-list-item-title class="blue--text">
              Primal Disperser
            </v-list-item-title>
          </v-list-item>
        </v-list-group>

        <v-list-group active-class="list-active" sub-group>
          <template v-slot:activator>
            <v-list-item-title>Seed</v-list-item-title>
          </template>

          <v-list-group active-class="list-active" sub-group>
            <template v-slot:activator>
              <v-list-item-title>T1</v-list-item-title>
            </template>
            <v-list-item @click="setPlacement('1', 0)">
              <v-list-item-title class="purple--text text--lighten-2">
                Wild T1 Seed
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setPlacement('1', 1)">
              <v-list-item-title class="yellow--text text--darken-4">
                Vivid T1 Seed
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setPlacement('1', 2)">
              <v-list-item-title class="blue--text">
                Primal T1 Seed
              </v-list-item-title>
            </v-list-item>
          </v-list-group>

          <v-list-group active-class="list-active" sub-group>
            <template v-slot:activator>
              <v-list-item-title>T2</v-list-item-title>
            </template>
            <v-list-item @click="setPlacement('2', 0)">
              <v-list-item-title class="purple--text text--lighten-2">
                Wild T2 Seed
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setPlacement('2', 1)">
              <v-list-item-title class="yellow--text text--darken-4">
                Vivid T2 Seed
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setPlacement('2', 2)">
              <v-list-item-title class="blue--text">
                Primal T2 Seed
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group active-class="list-active" sub-group>
            <template v-slot:activator>
              <v-list-item-title>T3</v-list-item-title>
            </template>
            <v-list-item @click="setPlacement('3', 0)">
              <v-list-item-title class="purple--text text--lighten-2">
                Wild T3 Seed
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setPlacement('3', 1)">
              <v-list-item-title class="yellow--text text--darken-4">
                Vivid T3 Seed
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setPlacement('3', 2)">
              <v-list-item-title class="blue--text">
                Primal T3 Seed
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
          <v-list-group active-class="list-active" sub-group>
            <template v-slot:activator>
              <v-list-item-title>T4</v-list-item-title>
            </template>
            <v-list-item @click="setPlacement('4', 0)">
              <v-list-item-title class="purple--text text--lighten-2">
                Wild T4 Seed
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setPlacement('4', 1)">
              <v-list-item-title class="yellow--text text--darken-4">
                Vivid T4 Seed
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setPlacement('4', 2)">
              <v-list-item-title class="blue--text">
                Primal T4 Seed
              </v-list-item-title>
            </v-list-item>
          </v-list-group>
        </v-list-group>
        <v-list-item @click="clearPlacement">
          Clear Selected
        </v-list-item>
        <v-list-item @click="clearAllPlacement">
          Clear All
        </v-list-item>
        <!-- <v-list-item>
          <v-switch label="Display Collector Range"></v-switch>
        </v-list-item>
        <v-list-item>
          <v-switch label="Display Disperser Range"></v-switch>
        </v-list-item>
        <v-list-item>
          <v-switch label="Display Pylon Link"></v-switch>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import GridView from "@/components/GridView.vue";
export default Vue.extend({
  name: "App",
  components: {
    GridView
  },
  async mounted() {
    await this.$nextTick();
    this.layoutText = localStorage.getItem("storedSetup") || "[]";
    this.importLayout();
  },
  methods: {
    githubRepo() {
      location.href = "https://github.com/caxerx/PoEHarvestPlanner";
    },
    undo() {
      this.layoutText = (this.$refs.grid as any).undoPlacement();
    },
    redo() {
      this.layoutText = (this.$refs.grid as any).redoPlacement();
    },
    showImportDialog() {
      this.isShowImportDialog = true;
      this.layoutText = "";
    },
    showExportDialog() {
      this.isShowExportDialog = true;
      this.layoutText = (this.$refs.grid as any).exportPlacement();
    },
    importLayout() {
      (this.$refs.grid as any).importPlacement(this.layoutText);
      this.isShowImportDialog = false;
    },
    selectedStyleChange(s: {
      top: string;
      left: string;
      width: string;
      height: string;
    }) {
      this.$set(this, "selectedCellStyle", s);
    },
    placementStyleChange(s: object[]) {
      this.$set(this, "placementCellStyle", s);
    },
    collectorRangeChange(s: object[]) {
      this.$set(this, "collectorRangeStyle", s);
    },
    hoveringRangeChange(s: object) {
      this.$set(this, "hoveringCellStyle", s);
    },
    setPlacement(
      type: "P" | "C" | "S" | "D" | "1" | "2" | "3" | "4",
      color?: number
    ) {
      (this.$refs.grid as any).setPlacement(type, color);
    },
    clearPlacement() {
      (this.$refs.grid as any).clearPlacement();
    },
    clearAllPlacement() {
      (this.$refs.grid as any).clearAllPlacement();
    }
  },
  data: () => ({
    isShowImportDialog: false,
    isShowExportDialog: false,
    layoutText: "",
    placementCellStyle: [],
    collectorRangeStyle: [],
    hoveringCellStyle: null,
    selectedCellStyle: {
      top: `0px`,
      left: `0px`,
      width: `0px`,
      height: `0px`,
      border: `none`
    }
  })
});
</script>
<style>
.hovering-range {
  border: 2px solid grey;
  box-shadow: 0px 0px 4px grey;
  position: absolute;
}

.selected-cell-range {
  border: 2px solid red;
  box-shadow: 0px 0px 4px red;
  z-index: 2;
  pointer-events: none;
  position: absolute;
}
.list-active {
  color: white !important;
}

.cell-placement {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  user-select: none;
}

.collector-range {
  pointer-events: none;
  position: absolute;
}

.seed-0 {
  border: 2px solid #9c27b0;
  box-shadow: 0px 0px 4px #9c27b0;
  background-color: rgba(156, 39, 176, 0.2);
}

.seed-1 {
  border: 2px solid #f57f17;
  box-shadow: 0px 0px 4px #f57f17;
  background-color: rgba(245, 127, 23, 0.2);
}

.seed-2 {
  border: 2px solid #2196f3;
  box-shadow: 0px 0px 4px #2196f3;
  background-color: rgba(33, 150, 243, 0.2);
}
</style>

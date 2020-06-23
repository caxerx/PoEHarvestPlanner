<template>
  <v-app>
    <v-navigation-drawer app width="350" style="user-select: none">
      <DrawerPlacementSelection @place="placeItem"></DrawerPlacementSelection>
    </v-navigation-drawer>
    <v-app-bar app style="z-index: 100">
      <v-btn @click="undo" :disabled="lastStep.length <= 0">
        <v-icon>
          mdi-undo
        </v-icon>
        Undo
      </v-btn>
      <v-btn @click="redo" :disabled="nextStep.length <= 0">
        <v-icon>
          mdi-redo
        </v-icon>
        Redo
      </v-btn>
      <v-btn color="grey" @click="showImportDialog = true"
        >Import From v1</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn icon @click="showHelpDialog = true"
        ><v-icon>mdi-help-circle</v-icon></v-btn
      >
      <v-btn icon @click="sharePlan"><v-icon>mdi-share-variant</v-icon></v-btn>
      <v-btn icon @click="showSettingDialog = true"
        ><v-icon>mdi-settings</v-icon></v-btn
      >
      <v-btn icon href="https://github.com/caxerx/PoEHarvestPlanner"
        ><v-icon>mdi-github-circle</v-icon></v-btn
      >
    </v-app-bar>

    <v-snackbar v-model="failSnackbar" multi-line :timeout="3000">
      Failed to generate link, you can still share the plan by copy current url
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="failSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="linkCopiedSnackbar" multi-line :timeout="3000">
      Link Copied
      <template v-slot:action="{ attrs }">
        <v-btn
          color="red"
          text
          v-bind="attrs"
          @click="linkCopiedSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-dialog v-model="showImportDialog">
      <v-card>
        <v-card-title>
          Import Layout
        </v-card-title>
        <v-card-text>
          <v-textarea outlined hide-details v-model="layoutText"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="importLayout">Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="showHelpDialog">
      <v-card>
        <v-card-title>
          Help
        </v-card-title>
        <v-card-text>
          <v-row>
            Right Click and drag: Connect Pylon
          </v-row>
          <v-row>
            Ctrl + A: Select All
          </v-row>
          <v-row>
            Ctrl + Z: Undo
          </v-row>
          <v-row>
            Esc: Cancel Select
          </v-row>
          <v-row>
            Delete: Delete Selected Item
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="showShareDialog">
      <v-card>
        <v-card-title>
          Share
        </v-card-title>
        <v-card-text>
          <v-row align="center" justify="center">
            <v-col>
              <v-text-field
                outlined
                hide-details
                ref="linkTextField"
                readonly
                v-model="planLink"
              ></v-text-field>
            </v-col>
            <v-col cols="auto">
              <v-btn text @click="copyLink">Copy</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog max-width="500" v-model="showSettingDialog">
      <v-card>
        <v-card-title>
          Settings
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-switch
                label="Always Show Pylon Link"
                v-model="settings.alwaysShowPylonLink"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-switch
                label="Always Show Pylon Area"
                v-model="settings.alwaysShowPylonArea"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-switch
                label="Always Show Collector Area"
                v-model="settings.alwaysShowCollectorArea"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-switch
                label="Always Show Disperser Area"
                v-model="settings.alwaysShowDisperserArea"
              ></v-switch> </v-col
          ></v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-main>
      <v-row>
        <v-col class="ml-5 mt-2">
          <div class="display-container">
            <GridSelection
              v-model="selectingArea"
              :connecting.sync="connectingPoints"
              :selection.sync="selection"
              :connection.sync="connection"
              :hovering.sync="hoveringCell"
            ></GridSelection>
            <GridSelectArea
              :selection="selectingArea"
              :link-hovering="linkHovering"
              :inference-area="inferenceAreas"
            ></GridSelectArea>
            <GridDisplay></GridDisplay>
            <GridConnection
              :connecting="connectingPoints"
              :connections="pylonConnections"
            ></GridConnection>
            <PlacementDisplay
              :placement="cellPlacementDisplay"
            ></PlacementDisplay>
          </div>
        </v-col>
        <v-col
          class="mr-3"
          style="user-select: none; max-height: calc(100vh - 64px); overflow-y: auto;"
        >
          <div v-if="selectedPlacement.length > 0">
            <v-subheader>
              Selected
              <v-spacer></v-spacer>
              <v-btn text @click="clearPlacement">Clear</v-btn>
            </v-subheader>
            <v-card>
              <v-list-item
                dense
                v-for="(p, i) in selectedPlacement"
                :key="`placement-list-item-${i}`"
                @mouseover="hoverLinkItem([p.x, p.y])"
                @mouseleave="hoverLinkItem(null)"
                link
              >
                <v-list-item-content>
                  <v-list-item-title
                    :class="getPlacementProp(p.x, p.y).color"
                    >{{ getPlacementProp(p.x, p.y).name }}</v-list-item-title
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="removePlacement(p.x, p.y)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-card>
          </div>
          <div
            v-if="
              isSingleSelection() &&
                findPlacement(...selection[0]) &&
                findPylonConnection(findPlacement(...selection[0])).length > 0
            "
          >
            <v-subheader>
              Linking
            </v-subheader>
            <v-card>
              <template
                v-for="(c, i) in findPylonConnection(
                  findPlacement(...selection[0])
                )"
              >
                <v-divider :key="`divider-${i}`" v-if="i != 0"></v-divider>
                <v-list-item
                  dense
                  :key="`list-item-${i}`"
                  link
                  @mouseover="
                    hoverLinkItem(
                      getLinkedPlacementPos(selection[0], [c.x, c.y])
                    )
                  "
                  @mouseleave="hoverLinkItem(null)"
                  @click="
                    setSelection(
                      ...getLinkedPlacementPos(selection[0], [c.x, c.y])
                    )
                  "
                >
                  <v-list-item-content>
                    <v-list-item-title
                      :class="
                        getPlacementProp(
                          ...getLinkedPlacementPos(selection[0], [c.x, c.y])
                        ).color
                      "
                    >
                      {{
                        getPlacementProp(
                          ...getLinkedPlacementPos(selection[0], [c.x, c.y])
                        ).name
                      }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn icon @click="removeConnection(c)">
                      <v-icon>mdi-link-variant-off</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue from "vue";
import GridDisplay from "@/components/GridDisplay.vue";
import GridSelection from "@/components/GridSelection.vue";
import GridSelectArea from "@/components/GridSelectArea.vue";
import DrawerPlacementSelection from "@/components/DrawerPlacementSelection.vue";
import GridConnection from "@/components/GridConnection.vue";
import PlacementDisplay from "@/components/PlacementDisplay.vue";
import { CellPlacement } from "@/types/CellPlacement";
import { generateSelectedCell } from "@/utils/cell-calc";
import { InferenceArea } from "./types/CellPlacement";
import Layout from "@/layout/harvest-layout.json";
import { getShare, fromShare } from "./utils/link-share";
import Axios from "axios";

export default Vue.extend({
  props: {
    planData: {
      default: ""
    }
  },
  name: "Main",
  components: {
    GridDisplay,
    GridSelection,
    GridSelectArea,
    DrawerPlacementSelection,
    GridConnection,
    PlacementDisplay
  },
  created() {
    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      this.$set(this, "settings", JSON.parse(storedSettings));
    }
    document.addEventListener("keyup", this.keyboardListener);
    if (+(localStorage.getItem("version") ?? 0) < 1) {
      localStorage.setItem("version", "1");
      this.showHelpDialog = true;
    }
    if (!this.planData) {
      this.$set(
        this,
        "cellPlacement",
        JSON.parse(localStorage.getItem("storedSetup") ?? "[]")
      );
    }
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.keyboardListener);
  },
  data() {
    return {
      layoutText: "",
      planLink: "",
      failSnackbar: false,
      linkCopiedSnackbar: false,
      routerSetting: false,
      showImportDialog: false,
      showHelpDialog: false,
      showShareDialog: false,
      showSettingDialog: false,
      objectName: {
        P: "Pylon",
        C: "Collector",
        S: "Storage",
        D: "Disperser",
        "1": "Tier 1 Seed",
        "2": "Tier 2 Seed",
        "3": "Tier 3 Seed",
        "4": "Tier 4 Seed"
      } as any,
      color: ["purple--text", "yellow--text", "blue--text"],
      selectingArea: [],
      connectingPoints: [],
      linkHovering: [] as number[],
      selection: [] as number[][],
      connection: [] as number[][],
      cellPlacement: [] as CellPlacement[],
      hoveringCell: [] as number[],
      lastStep: [] as string[],
      nextStep: [] as string[],
      settings: {
        alwaysShowPylonLink: false,
        alwaysShowPylonArea: false,
        alwaysShowCollectorArea: false,
        alwaysShowDisperserArea: false
      },
      isUndo: false,
      isRedo: false
    };
  },
  methods: {
    importLayout() {
      this.$set(this, "cellPlacement", JSON.parse(this.layoutText));
      this.layoutText = "";
      this.showImportDialog = false;
    },
    async undo() {
      if (this.lastStep.length <= 0) {
        return;
      }
      this.nextStep.push(JSON.stringify(this.cellPlacement));
      this.isUndo = true;
      await this.$nextTick();
      const lastStep = this.lastStep.pop() || "[]";
      this.$set(this, "cellPlacement", JSON.parse(lastStep));
      await this.$nextTick();
      this.isUndo = false;
    },
    async redo() {
      if (this.nextStep.length <= 0) {
        return;
      }
      this.isRedo = true;
      await this.$nextTick();
      this.$set(this, "cellPlacement", JSON.parse(this.nextStep.pop() || "[]"));
      await this.$nextTick();
      this.isRedo = false;
    },
    copyLink() {
      (this.$refs.linkTextField as any).$refs.input.select();
      document.execCommand("copy");
      this.linkCopiedSnackbar = true;
    },
    async sharePlan() {
      try {
        const result = await Axios.post("https://iw.gy/shorten", {
          url: `${window.location.origin}/#/${getShare(this.cellPlacement)}`
        });
        this.planLink = result.data.shortenedLink;
        this.showShareDialog = true;
      } catch {
        this.failSnackbar = true;
      }
    },
    isSingleSelection() {
      return (
        this.selection[0] &&
        this.selection[1] &&
        this.selection[0][0] == this.selection[1][0] &&
        this.selection[0][1] == this.selection[1][1]
      );
    },
    keyboardListener(e: KeyboardEvent) {
      if (e.keyCode == 90 && e.ctrlKey) {
        this.undo();
      }
      if (e.keyCode == 46) {
        this.clearPlacement();
      }
      if (e.keyCode == 27) {
        this.selection = [];
        this.selectingArea = [];
      }
    },
    clearPlacement() {
      generateSelectedCell(this.selection).forEach(i => {
        this.removePlacement(i[0], i[1]);
      });
    },
    clearAllPlacement() {
      this.$set(this, "cellPlacement", []);
    },
    getLinkedPlacementPos(current: number[], connection: number[][]) {
      const [cx, cy] = connection;
      if (current[0] == cx[0] && current[1] == cy[0]) {
        return [cx[1], cy[1]];
      }
      return [cx[0], cy[0]];
    },
    hoverLinkItem(c: number[] | null) {
      this.linkHovering = c || [];
    },
    setSelection(i: number, j: number) {
      this.$set(this, "selectingArea", [
        [i, j],
        [i, j]
      ]);
      this.$set(this, "selection", [
        [i, j],
        [i, j]
      ]);
    },
    getPlacementProp(i: number, j: number) {
      const placementObj = this.findPlacement(i, j);
      const placement = placementObj?.text;
      const placementColor = placementObj?.color;
      return {
        name: placement ? this.objectName[placement] : "",
        color: this.color[placementColor ?? -1]
      };
    },
    placeItem(args: any[]) {
      this.setPlacement(this.selection, args[0], args[1]);
    },
    checkHoverable(i: number, j: number) {
      return Layout[i - 1][j - 1] == 0;
    },
    setPlacement(
      selectedArea: number[][],
      type: "P" | "C" | "S" | "D" | "1" | "2" | "3" | "4",
      color?: number
    ) {
      generateSelectedCell(selectedArea).forEach(i => {
        if (!this.checkHoverable(i[0], i[1])) {
          return;
        }
        this.addPlacement({
          x: i[0],
          y: i[1],
          text: type,
          color
        });
      });
    },
    removePlacement(i: number, j: number) {
      const index = this.cellPlacement.findIndex(o => o.x == i && o.y == j);
      if (index >= 0) {
        this.cellPlacement.splice(index, 1);
      }
      this.cellPlacement
        .filter(
          c =>
            c.text == "connection" &&
            (((c.x as number[])[0] == i && (c.y as number[])[0] == j) ||
              ((c.x as number[])[1] == i && (c.y as number[])[1] == j))
        )
        .forEach(c => this.removeConnection(c));
      this.hoverLinkItem(null);
    },
    addPlacement(placement: CellPlacement) {
      const index = this.cellPlacement.findIndex(
        i => i.x == placement.x && i.y == placement.y
      );
      if (index >= 0) {
        this.cellPlacement.splice(index, 1);
      }
      this.cellPlacement.push(placement);
    },
    findPlacement(i: number, j: number): CellPlacement | undefined {
      return this.cellPlacement.find(o => o.x == i && o.y == j);
    },
    findPylonConnection(pylon: CellPlacement) {
      return this.cellPlacement.filter(
        p =>
          p.text == "connection" &&
          typeof p.x != "number" &&
          typeof p.y != "number" &&
          ((pylon.x == p.x[0] && pylon.y == p.y[0]) ||
            (pylon.x == p.x[1] && pylon.y == p.y[1]))
      );
    },
    findConnection(p1: CellPlacement, p2: CellPlacement) {
      let [x1, x2, y1, y2] = [+p1.x, +p2.x, +p1.y, +p2.y];
      if (x1 > x2) {
        [x1, x2] = [x2, x1];
        [y1, y2] = [y2, y1];
      }
      return this.cellPlacement.find(
        p =>
          p.text == "connection" &&
          typeof p.x != "number" &&
          typeof p.y != "number" &&
          x1 == p.x[0] &&
          x2 == p.x[1] &&
          y1 == p.y[0] &&
          y2 == p.y[1]
      );
    },
    addConnection(p1: CellPlacement, p2: CellPlacement) {
      if (this.findConnection(p1, p2)) {
        return;
      }
      if (p1 == p2) {
        return;
      }
      const [x1, x2, y1, y2] = [+p1.x, +p2.x, +p1.y, +p2.y];
      this.cellPlacement.push({
        color: p1.color,
        text: "connection",
        x: x1 > x2 ? [x2, x1] : [x1, x2],
        y: x1 > x2 ? [y2, y1] : [y1, y2]
      });
    },
    setConnection() {
      const p1 = this.findPlacement(
        this.connection[0][0],
        this.connection[0][1]
      );
      const p2 = this.findPlacement(
        this.connection[1][0],
        this.connection[1][1]
      );
      if (!(p1 && p2) || (p1.text != "P" && p2.text != "P")) {
        return;
      }
      this.addConnection(p1, p2);
    },
    removeConnection(c: CellPlacement) {
      this.cellPlacement.splice(this.cellPlacement.indexOf(c), 1);
      this.hoverLinkItem(null);
    },
    convertPlacementToInference(
      placement: CellPlacement | null | undefined
    ): InferenceArea | null {
      if (!placement) {
        return null;
      }
      if (placement.text == "P") {
        return {
          topLeft: [+placement.x - 4, +placement.y - 4],
          size: 8,
          color: placement.color
        };
      }
      if (placement.text == "D" || placement.text == "C") {
        return {
          topLeft: [+placement.x - 2, +placement.y - 2],
          size: 4,
          color: placement.color
        };
      }
      return null;
    }
  },
  computed: {
    stringifyCellPlacement(): string {
      return JSON.stringify(this.cellPlacement);
    },
    selectedPlacement(): any {
      if (!(this.selection[0] && this.selection[1])) {
        return [];
      }
      return generateSelectedCell(this.selection)
        .map(c => this.findPlacement(c[0], c[1]))
        .filter(c => !!c && c.text != "connection");
    },
    inferenceAreas() {
      const inference: InferenceArea[] = [];

      const placementHover = this.convertPlacementToInference(
        this.findPlacement(this.hoveringCell[0], this.hoveringCell[1])
      );
      if (placementHover) {
        inference.push(placementHover);
      }

      const placementSelection = this.convertPlacementToInference(
        this.findPlacement(this.selection[0]?.[0], this.selection[0]?.[1])
      );
      if (placementSelection) {
        inference.push(placementSelection);
      }

      if (this.settings.alwaysShowPylonArea) {
        inference.push(
          ...(this.cellPlacement
            .filter(p => p.text == "P")
            .map(p => this.convertPlacementToInference(p))
            .filter(p => p != null) as InferenceArea[])
        );
      }
      if (this.settings.alwaysShowCollectorArea) {
        inference.push(
          ...(this.cellPlacement
            .filter(p => p.text == "C")
            .map(p => this.convertPlacementToInference(p))
            .filter(p => p != null) as InferenceArea[])
        );
      }
      if (this.settings.alwaysShowDisperserArea) {
        inference.push(
          ...(this.cellPlacement
            .filter(p => p.text == "D")
            .map(p => this.convertPlacementToInference(p))
            .filter(p => p != null) as InferenceArea[])
        );
      }
      return inference;
    },
    pylonConnections(): CellPlacement[] {
      if (this.settings.alwaysShowPylonLink) {
        return this.cellPlacement.filter(p => p.text == "connection");
      } else {
        const placementHover = this.findPlacement(
          this.hoveringCell[0],
          this.hoveringCell[1]
        );
        const placementSelection = this.findPlacement(
          this.selection[0]?.[0],
          this.selection[0]?.[1]
        );
        const connections = [];
        if (placementHover) {
          connections.push(...this.findPylonConnection(placementHover));
        }
        if (placementSelection) {
          connections.push(...this.findPylonConnection(placementSelection));
        }
        return connections;
      }
    },
    cellPlacementDisplay(): CellPlacement[] {
      return this.cellPlacement.filter(p => p.text != "connection");
    }
  },
  watch: {
    settings: {
      deep: true,
      handler(val) {
        localStorage.setItem("settings", JSON.stringify(val));
      }
    },
    stringifyCellPlacement(val, old) {
      if (this.routerSetting) {
        return;
      }
      if (!this.isUndo) {
        this.lastStep.push(old);
      }
      if (!this.isUndo && !this.isRedo) {
        this.$set(this, "nextStep", []);
      }
    },
    planData: {
      immediate: true,
      async handler(val) {
        if (val && !this.routerSetting) {
          this.$set(this, "nextStep", []);
          this.$set(this, "lastStep", []);
          this.routerSetting = true;
          await this.$nextTick();
          this.$set(this, "cellPlacement", fromShare(val));
          await this.$nextTick();
          this.routerSetting = false;
        }
      }
    },
    async cellPlacement(val) {
      if (this.routerSetting) {
        return;
      }
      this.routerSetting = true;
      await this.$nextTick();
      this.$router.replace(`/${getShare(val)}`);
      localStorage.setItem("storedSetup", JSON.stringify(val));
      await this.$nextTick();
      this.routerSetting = false;
    },
    async connection() {
      this.$set(this, "connectingPoints", []);
      await this.$nextTick();
      this.setConnection();
    }
  }
});
</script>
<style scoped>
.display-container {
  position: relative;
}
</style>

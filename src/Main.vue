<template>
  <v-app>
    <v-navigation-drawer app width="300" style="user-select: none" permanent>
      <DrawerPlacementSelection
        @place="placeItem"
        :disablePlacementShortcout="disableShortcut"
      ></DrawerPlacementSelection>
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
      <v-select
        label="Link Filtering"
        hide-details
        v-model="settings.linkFilter"
        solo
        :items="linkFilterOptions"
        clearable
        item-text="label"
        item-value="value"
        v-if="settings.alwaysShowPylonLink"
      ></v-select>
      <v-spacer></v-spacer>
      <v-btn icon @click="showHelpDialog = true"
        ><v-icon>mdi-help-circle</v-icon></v-btn
      >
      <v-btn icon @click="sharePlan"><v-icon>mdi-share-variant</v-icon></v-btn>
      <v-btn icon @click="showSettingDialog = true"
        ><v-icon>mdi-cog</v-icon></v-btn
      >
      <v-btn icon @click="showLibraryDialog = true"
        ><v-icon>mdi-bookshelf</v-icon></v-btn
      >
      <v-btn icon href="https://github.com/caxerx/PoEHarvestPlanner"
        ><v-icon>mdi-github</v-icon></v-btn
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
    <v-dialog v-model="showConfirmDialog" max-width="300">
      <v-card>
        <v-card-title>
          {{ confirmMode == 0 ? "Replace Profile" : "Delete Profile" }}
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          Are you sure to {{ confirmMode == 0 ? "replace" : "delete" }} the
          profile?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showConfirmDialog = false">
            No
          </v-btn>
          <v-btn @click="confirmProfile()" color="primary">
            Yes
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showNamingDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ namingMode == 0 ? "Rename Profile" : "Create Profile" }}
          <v-spacer></v-spacer>
        </v-card-title>
        <v-card-text>
          <v-text-field
            hide-details
            v-model="profileName"
            outlined
            label="Profile Name"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="saveProfile">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showLibraryDialog" max-width="500">
      <v-card>
        <v-card-title>
          Profile Library
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="openCreateProfileDialog()"
                ><v-icon>mdi-content-save</v-icon></v-btn
              >
            </template>
            <span>Save current plan</span>
          </v-tooltip>
        </v-card-title>
        <v-card-text>
          <v-subheader v-if="profileLibrary.length == 0">
            No Saved Profile
          </v-subheader>
          <v-list dense v-else>
            <v-list-item
              v-for="(l, lIndex) in profileLibrary"
              :key="`profile-${lIndex}`"
            >
              <v-list-item-content>
                <v-list-item-title
                  >{{ l.name }}
                  <a class="ml-1" @click="openRenameProfileDialog(lIndex)"
                    >Rename</a
                  ></v-list-item-title
                >
                <v-list-item-subtitle>{{ l.time }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-row no-gutters>
                  <v-col cols="auto">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="loadSetup(l.content)"
                          ><v-icon>mdi-folder-open</v-icon></v-btn
                        >
                      </template>
                      <span>Load</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="auto">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="showReplaceConfirm(lIndex)"
                          ><v-icon>mdi-file-replace</v-icon></v-btn
                        >
                      </template>
                      <span>Replace with current setup</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="auto">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          @click="sharePlanOrProfile(l.content)"
                          icon
                          v-bind="attrs"
                          v-on="on"
                          ><v-icon>mdi-share-variant</v-icon></v-btn
                        >
                      </template>
                      <span>Share</span>
                    </v-tooltip>
                  </v-col>
                  <v-col cols="auto">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          @click="showDeleteConfirm(lIndex)"
                          icon
                          v-bind="attrs"
                          v-on="on"
                          ><v-icon>mdi-delete</v-icon></v-btn
                        >
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showImportDialog" max-width="500">
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
          <v-row>
            Arrow Key: Move Selection Area
          </v-row>
          <v-row>
            Alt : Change Selected Color
          </v-row>
          <v-row>
            P / D / S / C / 1 / 2 / 3 / 4 : Place Element to Selected Area
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
          <v-row>
            <v-col>
              <v-slider
                label="Area Indicator Opacity"
                v-model="settings.areaOpacity"
              ></v-slider> </v-col
          ></v-row>
          <v-row>
            <v-col>
              <v-slider
                label="Connection Line Opacity"
                v-model="settings.linkOpacity"
              ></v-slider> </v-col
          ></v-row>

          <v-row>
            <v-col>
              <v-slider
                label="Element Opacity"
                v-model="settings.placementOpacity"
              ></v-slider> </v-col
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
              :disablePlacementShortcout="disableShortcut"
            ></GridSelection>
            <GridSelectArea
              :selection="selectingArea"
              :link-hovering="linkHovering"
              :inference-area="inferenceAreas"
              :backgroundAlpha="settings.areaOpacity / 100"
            ></GridSelectArea>
            <GridDisplay></GridDisplay>
            <GridConnection
              :connecting="connectingPoints"
              :connections="pylonConnections"
              :select-conntect="selectedOrHoveringConnection"
              :connectionAlpha="settings.linkOpacity / 100"
            ></GridConnection>
            <PlacementDisplay
              :placement="cellPlacementDisplay"
              :is-connecting="isConnecting"
              :link-point="selectedOrHoveringPlacement"
              :defaultItemAlpha="settings.placementOpacity / 100"
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
          </div>
          <div v-else>
            <CountTable :overview="placementOverview"></CountTable>
            <v-subheader>
              Right Click and drag: Connect Pylon
            </v-subheader>
            <v-subheader>
              Ctrl + A: Select All
            </v-subheader>
            <v-subheader>
              Ctrl + Z: Undo
            </v-subheader>
            <v-subheader>
              Esc: Cancel Select
            </v-subheader>
            <v-subheader>
              Delete: Delete Selected Item
            </v-subheader>
            <v-subheader>
              Arrow Key: Move Selection Area
            </v-subheader>
            <v-subheader>
              Alt : Change Selected Color
            </v-subheader>
            <v-subheader>
              P / D / S / C / 1 / 2 / 3 / 4 : Place Element to Selected Area
            </v-subheader>
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
import CountTable from "@/components/CountTable.vue";
import { CellPlacement } from "@/types/CellPlacement";
import { generateSelectedCell, calcMoveCell } from "@/utils/cell-calc";
import { isSeed } from "@/utils/placement-util";
import { InferenceArea } from "./types/CellPlacement";
import Layout from "@/layout/harvest-layout.json";
import { getShare, fromShare } from "./utils/link-share";
import Axios from "axios";
import moment from "moment";
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
    PlacementDisplay,
    CountTable
  },
  created() {
    const storedLibrary = localStorage.getItem("library");
    if (storedLibrary) {
      this.$set(this, "profileLibrary", JSON.parse(storedLibrary));
    }

    const storedSettings = localStorage.getItem("settings");
    if (storedSettings) {
      this.$set(this, "settings", {
        ...this.settings,
        ...JSON.parse(storedSettings)
      });
    }
    document.addEventListener("keydown", this.moveListener);
    document.addEventListener("keyup", this.keyboardListener);
    if (+(localStorage.getItem("version") ?? 0) < 2) {
      localStorage.setItem("version", "2");
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
    document.removeEventListener("keydown", this.moveListener);
    document.removeEventListener("keyup", this.keyboardListener);
  },
  data() {
    return {
      linkFilterOptions: [
        {
          label: "Wild",
          value: 0
        },
        {
          label: "Vivid",
          value: 1
        },
        {
          label: "Primal",
          value: 2
        }
      ],
      row: 42,
      col: 42,
      moveInterval: [null, null, null, null],
      layoutText: "",
      planLink: "",
      failSnackbar: false,
      linkCopiedSnackbar: false,
      routerSetting: false,
      profileName: "",
      namingMode: 0,
      renameItem: 0,
      confirmMode: 0,
      confirmItem: 0,
      showConfirmDialog: false,
      showNamingDialog: false,
      showLibraryDialog: false,
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
      selectingArea: [] as number[][],
      connectingPoints: [],
      linkHovering: [] as number[],
      selection: [] as number[][],
      connection: [] as number[][],
      cellPlacement: [] as CellPlacement[],
      hoveringCell: [] as number[],
      lastStep: [] as string[],
      nextStep: [] as string[],
      settings: {
        linkOpacity: 50,
        areaOpacity: 10,
        placementOpacity: 70,
        linkFilter: null,
        alwaysShowPylonLink: false,
        alwaysShowPylonArea: false,
        alwaysShowCollectorArea: false,
        alwaysShowDisperserArea: false
      },
      isUndo: false,
      isRedo: false,
      seed: ["1", "2", "3", "4"],
      profileLibrary: [] as any[]
    };
  },
  methods: {
    confirmProfile() {
      if (this.confirmMode == 0) {
        this.replaceProfile();
      } else if (this.confirmMode == 1) {
        this.deleteProfile();
      }
      this.showConfirmDialog = false;
    },
    deleteProfile() {
      this.profileLibrary.splice(this.confirmItem, 1);
    },
    replaceProfile() {
      this.profileLibrary[this.confirmItem].time = moment().format(
        "YYYY-MM-DD HH:mm"
      );
      this.profileLibrary[this.confirmItem].content = getShare(
        this.cellPlacement
      );
    },
    showDeleteConfirm(index: number) {
      this.confirmItem = index;
      this.confirmMode = 1;
      this.showConfirmDialog = true;
    },
    showReplaceConfirm(index: number) {
      this.confirmItem = index;
      this.confirmMode = 0;
      this.showConfirmDialog = true;
    },
    loadSetup(placement: string) {
      this.$router.replace(`/${placement}`);
      this.showLibraryDialog = false;
    },
    saveProfile() {
      if (this.namingMode == 0) {
        if (this.profileLibrary[this.renameItem]) {
          this.profileLibrary[this.renameItem].name = this.profileName;
        }
      } else if (this.namingMode == 1) {
        this.profileLibrary.push({
          name: this.profileName,
          time: moment().format("YYYY-MM-DD HH:mm"),
          content: getShare(this.cellPlacement)
        });
      }
      this.showNamingDialog = false;
    },
    openRenameProfileDialog(index: number) {
      this.namingMode = 0;
      this.renameItem = index;
      this.profileName = this.profileLibrary[index]?.name ?? "";
      this.showNamingDialog = true;
    },
    openCreateProfileDialog() {
      this.namingMode = 1;
      this.profileName = "";
      this.showNamingDialog = true;
    },
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
    sharePlan() {
      this.sharePlanOrProfile(getShare(this.cellPlacement));
    },
    async sharePlanOrProfile(profile: string) {
      try {
        const result = await Axios.post("https://iw.gy/shorten", {
          url: `${window.location.origin}/#/${profile}`
        });
        this.planLink = result.data.shortenedLink;
        this.showShareDialog = true;
      } catch {
        this.failSnackbar = true;
      }
    },
    isSelected() {
      return (
        this.selection[0] &&
        this.selection[1] &&
        this.selection[0][0] >= 0 &&
        this.selection[1][0] >= 0 &&
        this.selection[0][1] >= 0 &&
        this.selection[1][1] >= 0
      );
    },
    isSingleSelection() {
      return (
        this.selection[0] &&
        this.selection[1] &&
        this.selection[0][0] == this.selection[1][0] &&
        this.selection[0][1] == this.selection[1][1]
      );
    },
    moveListener(e: KeyboardEvent) {
      let moveCell: number = e.shiftKey ? 5 : 1;
      if (this.isSelected()) {
        let [x0, x1, y0, y1] = [
          this.selectingArea[0][0],
          this.selectingArea[1][0],
          this.selectingArea[0][1],
          this.selectingArea[1][1]
        ];
        if (e.keyCode == 37) {
          moveCell = -moveCell;
          [y0, y1] = calcMoveCell(y0, y1, moveCell, this.row);
          this.$set(this.selectingArea[0], 1, y1);
          this.$set(this.selectingArea[1], 1, y0);
        }
        if (e.keyCode == 38) {
          moveCell = -moveCell;
          [x0, x1] = calcMoveCell(x0, x1, moveCell, this.col);
          this.$set(this.selectingArea[0], 0, x1);
          this.$set(this.selectingArea[1], 0, x0);
        }
        if (e.keyCode == 39) {
          [y0, y1] = calcMoveCell(y0, y1, moveCell, this.row);
          this.$set(this.selectingArea[1], 1, y0);
          this.$set(this.selectingArea[0], 1, y1);
        }
        if (e.keyCode == 40) {
          [x0, x1] = calcMoveCell(x0, x1, moveCell, this.col);
          this.$set(this.selectingArea[1], 0, x0);
          this.$set(this.selectingArea[0], 0, x1);
        }
      }
    },
    keyboardListener(e: KeyboardEvent) {
      if (e.keyCode == 90 && e.ctrlKey) {
        this.undo();
        return;
      }
      if (e.keyCode == 46) {
        this.clearPlacement();
        return;
      }
      if (e.keyCode == 27) {
        this.selection = [];
        this.selectingArea = [];
        return;
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
      if (!this.isSelected()) {
        return;
      }
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
    findPlacementFromConnection(connection: CellPlacement) {
      if (
        !connection ||
        connection.text != "connection" ||
        typeof connection.x == "number" ||
        typeof connection.y == "number"
      ) {
        return [];
      }
      return [
        this.findPlacement(connection.x[0], connection.y[0]),
        this.findPlacement(connection.x[1], connection.y[1])
      ];
    },
    findPylonConnection(pylon: CellPlacement | undefined) {
      if (!pylon) return [];
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
      if (isSeed(p1) || isSeed(p2)) {
        return;
      }
      if (p1.text)
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
    },
    splitOverviewColor(placement: CellPlacement[]) {
      return {
        wild: placement.filter(c => c.color == 0).length,
        vivid: placement.filter(c => c.color == 1).length,
        primal: placement.filter(c => c.color == 2).length,
        total: placement.length
      };
    }
  },
  computed: {
    disableShortcut(): boolean {
      return this.showNamingDialog || this.showShareDialog;
    },
    placementOverview(): any {
      const pylon = this.cellPlacement.filter(c => c.text === "P");
      const storage = this.cellPlacement.filter(c => c.text === "S");
      const disperser = this.cellPlacement.filter(c => c.text === "D");
      const collector = this.cellPlacement.filter(c => c.text === "C");
      return {
        pylon: this.splitOverviewColor(pylon),
        storage: this.splitOverviewColor(storage),
        disperser: this.splitOverviewColor(disperser),
        collector: this.splitOverviewColor(collector)
      };
    },
    selectedOrHoveringConnection() {
      let placement: CellPlacement[] = [];
      if (this.isSingleSelection()) {
        const selectPlacement = this.findPlacement(
          this.selection[0][0],
          this.selection[0][1]
        );
        placement.push(...this.findPylonConnection(selectPlacement));
      }

      const hoverPlacement = this.findPlacement(
        this.hoveringCell[0],
        this.hoveringCell[1]
      );

      if (hoverPlacement) {
        placement.push(...this.findPylonConnection(hoverPlacement));
      }

      placement = placement.filter((f, i) => placement.indexOf(f) == i);
      return placement;
    },
    selectedOrHoveringPlacement() {
      let placement: CellPlacement[] = [];
      if (this.isSingleSelection()) {
        const selectPlacement = this.findPlacement(
          this.selection[0][0],
          this.selection[0][1]
        );
        if (selectPlacement) {
          placement.push(selectPlacement);
        }

        this.findPylonConnection(selectPlacement).forEach(con => {
          this.findPlacementFromConnection(con).forEach(e => {
            if (e) {
              placement.push(e);
            }
          });
        });
      }

      const hoverPlacement = this.findPlacement(
        this.hoveringCell[0],
        this.hoveringCell[1]
      );
      if (hoverPlacement) {
        placement.push(hoverPlacement);

        this.findPylonConnection(hoverPlacement).forEach(con => {
          this.findPlacementFromConnection(con).forEach(e => {
            if (e) {
              placement.push(e);
            }
          });
        });
      }

      placement = placement.filter((f, i) => placement.indexOf(f) == i);
      return placement;
    },
    isConnecting(): boolean {
      return !!this.connectingPoints[0];
    },
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
      let connections: CellPlacement[] = [];
      if (this.settings.alwaysShowPylonLink) {
        if (typeof this.settings.linkFilter === "number") {
          connections = this.cellPlacement
            .filter(p => p.text == "connection")
            .filter(p => p.color == this.settings.linkFilter);
        } else {
          connections = this.cellPlacement.filter(p => p.text == "connection");
        }
      }
      const placementHover = this.findPlacement(
        this.hoveringCell[0],
        this.hoveringCell[1]
      );
      const placementSelection = this.findPlacement(
        this.selection[0]?.[0],
        this.selection[0]?.[1]
      );
      if (placementHover) {
        connections.push(...this.findPylonConnection(placementHover));
      }
      if (placementSelection) {
        connections.push(...this.findPylonConnection(placementSelection));
      }
      return connections;
    },
    cellPlacementDisplay(): CellPlacement[] {
      return this.cellPlacement.filter(p => p.text != "connection");
    }
  },
  watch: {
    profileLibrary: {
      deep: true,
      handler(val) {
        localStorage.setItem("library", JSON.stringify(val));
      }
    },
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

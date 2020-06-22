<template>
  <v-app>
    <v-navigation-drawer app width="350" style="user-select: none">
      <DrawerPlacementSelection @place="placeItem"></DrawerPlacementSelection>
    </v-navigation-drawer>
    <v-app-bar app></v-app-bar>
    <v-main>
      <v-row>
        <v-col class="ml-5 mt-2">
          <div class="display-container">
            <GridSelection
              v-model="selectingArea"
              :connecting.sync="connectingPoints"
              :selection.sync="selection"
              :connection.sync="connection"
            ></GridSelection>
            <GridSelectArea :selection="selectingArea"></GridSelectArea>
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
        <v-col> </v-col>
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

export default Vue.extend({
  name: "App",
  components: {
    GridDisplay,
    GridSelection,
    GridSelectArea,
    DrawerPlacementSelection,
    GridConnection,
    PlacementDisplay
  },
  data() {
    return {
      selectingArea: [],
      connectingPoints: [],
      selection: [] as number[][],
      connection: [] as number[][],
      cellPlacement: [] as CellPlacement[]
    };
  },
  methods: {
    placeItem(args: any[]) {
      this.setPlacement(this.selection, args[0], args[1]);
    },
    setPlacement(
      selectedArea: number[][],
      type: "P" | "C" | "S" | "D" | "1" | "2" | "3" | "4",
      color?: number
    ) {
      generateSelectedCell(selectedArea).forEach(i => {
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
      return this.cellPlacement.filter(p => {
        p.text == "connection" &&
          typeof p.x != "number" &&
          typeof p.y != "number" &&
          ((pylon.x == p.x[0] && pylon.y == p.y[0]) ||
            (pylon.x == p.x[1] && pylon.y == p.y[1]));
      });
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
    }
  },
  computed: {
    pylonConnections(): CellPlacement[] {
      return this.cellPlacement.filter(p => p.text == "connection");
    },
    cellPlacementDisplay(): CellPlacement[] {
      return this.cellPlacement.filter(p => p.text != "connection");
    }
  },
  watch: {
    async connection() {
      this.$set(this, "connectingPoints", []);
      await this.$nextTick();
      this.setConnection();
    }
  }
});
/*
 window.location.origin;
*/
</script>
<style scoped>
.display-container {
  position: relative;
}
</style>

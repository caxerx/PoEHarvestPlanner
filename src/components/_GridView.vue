<template>
  <div @mousedown="selectStart" @mouseup="selectStop" @contextmenu.prevent>
    <template v-for="i in row">
      <div
        v-for="j in column"
        :style="cellStyle(i, j)"
        :key="`column-${i}-${j}`"
        :class="{
          cell: true,
          'hoverable-cell': cellHoverable(i, j)
        }"
        @mouseenter="cellHovered(i, j)"
        @mouseleave="cellLeaved(i, j)"
      ></div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "@/layout/harvest-layout.json";

interface CellPlacement {
  x: number;
  y: number;
  color?: number;
  text?: "P" | "C" | "S" | "D" | "1" | "2" | "3" | "4";
}

export default Vue.extend({
  name: "GridView",
  props: {
    size: { type: [Number], default: 20 },
    row: { type: [Number], default: 42 },
    column: { type: [Number], default: 42 }
  },
  created() {
    document.addEventListener("keyup", this.undoListener);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.undoListener);
  },
  data() {
    return {
      undo: false,
      redo: false,
      seedColor: ["#9C27B0", "#F57F17", "#2196F3"],
      cellData: Layout,
      color: [null, "green", "pink", "blue", "brown"],
      hoveringCell: [-1, -1],
      selectedCell: [
        [-1, -1],
        [-1, -1]
      ],
      selectingCell: [
        [-1, -1],
        [-1, -1]
      ],
      linkingCell: [
        [-1, -1],
        [-1, -1]
      ],
      cellPlacement: [] as CellPlacement[],
      selectingMode: false,
      pylonLinkingMode: false,
      lastStep: [] as string[],
      nextStep: [] as string[]
    };
  },
  methods: {
    undoListener(e: any) {
      if (e.keyCode == 90 && e.ctrlKey) {
        this.undoPlacement();
      }
      if (e.keyCode == 65 && e.ctrlKey) {
        this.$set(this, "selectedCell", [
          [1, 1],
          [this.row, this.column]
        ]);
        this.$set(this, "selectingCell", [
          [1, 1],
          [this.row, this.column]
        ]);
      }
    },
    exportPlacement() {
      return JSON.stringify(this.cellPlacement);
    },
    async importPlacement(placement: string) {
      this.undo = true;
      await this.$nextTick();
      this.$set(this, "cellPlacement", JSON.parse(placement));
      await this.$nextTick();
      this.undo = false;
    },
    clearPlacement() {
      this.generateSelectedCell().forEach(i => {
        this.removePlacement(i[0], i[1]);
      });
    },
    clearAllPlacement() {
      this.$set(this, "cellPlacement", []);
    },
    findPlacement(i: number, j: number) {
      return this.cellPlacement.find(o => o.x == i && o.y == j);
    },
    removePlacement(i: number, j: number) {
      const index = this.cellPlacement.findIndex(o => o.x == i && o.y == j);
      if (index >= 0) {
        this.cellPlacement.splice(index, 1);
      }
    },
    addPlacement(placement: CellPlacement) {
      if (!this.cellHoverable(placement.x, placement.y)) {
        return;
      }
      const index = this.cellPlacement.findIndex(
        i => i.x == placement.x && i.y == placement.y
      );
      if (index >= 0) {
        this.cellPlacement.splice(index, 1);
      }
      this.cellPlacement.push(placement);
    },
    setPlacement(
      type: "P" | "C" | "S" | "D" | "1" | "2" | "3" | "4",
      color?: number
    ) {
      this.generateSelectedCell().forEach(i => {
        this.addPlacement({
          x: i[0],
          y: i[1],
          text: type,
          color
        });
      });
    },
    isSingleSelected(): boolean {
      return (
        this.selectedCell[0][0] != -1 &&
        JSON.stringify(this.selectedCell[0]) ==
          JSON.stringify(this.selectedCell[1])
      );
    },
    async selectStart(evt: any) {
      if (evt.button == 0) {
        this.$set(this.selectingCell, 0, this.hoveringCell);
        this.$set(this.selectingCell, 1, this.hoveringCell);
        this.selectingMode = true;
      }
      if (evt.button == 2) {
        this.$set(this.selectingCell, 0, this.hoveringCell);
        this.$set(this.selectingCell, 1, this.hoveringCell);
        if (this.findPlacement(this.hoveringCell[0], this.hoveringCell[1])) {
          this.pylonLinkingMode = true;
        }
      }
    },
    async selectStop(evt: any) {
      if (evt.button == 0) {
        this.$set(this.selectedCell, 0, this.selectingCell[0]);
        this.$set(this.selectedCell, 1, this.selectingCell[1]);
        this.selectingMode = false;
      }
      if (evt.button == 2) {
        this.pylonLinkingMode = false;
      }
    },
    generateSelectedCell() {
      let x0 = this.selectedCell[0][0];
      let x1 = this.selectedCell[1][0];
      let y0 = this.selectedCell[0][1];
      let y1 = this.selectedCell[1][1];
      if (x0 > x1) [x0, x1] = [x1, x0];
      if (y0 > y1) [y0, y1] = [y1, y0];
      const cells = [];
      for (let i = x0; i <= x1; i++) {
        for (let j = y0; j <= y1; j++) {
          cells.push([i, j]);
        }
      }
      return cells;
    },
    cellSelected(i: number, j: number) {
      if (!this.isAnySelected) return false;
      let x0 = this.selectedCell[0][0];
      let x1 = this.selectedCell[1][0];
      let y0 = this.selectedCell[0][1];
      let y1 = this.selectedCell[1][1];
      if (x0 > x1) [x0, x1] = [x1, x0];
      if (y0 > y1) [y0, y1] = [y1, y0];
      return i >= x0 && i <= x1 && j >= y0 && j <= y1;
    },
    cellHoverable(i: number, j: number) {
      if (i < 0 || j < 0) return false;
      return !this.cellData[i - 1]?.[j - 1];
    },
    async cellHovered(i: number, j: number) {
      if (this.selectingMode) {
        this.$set(this.selectingCell, 1, [i, j]);
      }
      this.$set(this, "hoveringCell", [i, j]);
    },
    async cellLeaved(i: number, j: number) {
      this.$set(this, "hoveringCell", [-1, -1]);
    },
    cellText(i: number, j: number) {
      if (!this.cellHoverable(i, j)) {
        return "";
      }
      const obj =
        this.cellPlacement.find((o: CellPlacement) => o.x == i && o.y == j) ??
        ({} as CellPlacement);
      return obj?.text;
    },
    cellObjectStyle(i: number, j: number) {
      if (!this.cellHoverable(i, j)) {
        return {};
      }

      const obj =
        this.cellPlacement.find((o: CellPlacement) => o.x == i && o.y == j) ??
        ({} as CellPlacement);
      return {
        "background-color": this.seedColor[obj?.color ?? -1]
      };
    },
    cellStyle(i: number, j: number) {
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
        top: `${(i - 1) * +this.size - i}px`,
        left: `${(j - 1) * +this.size - j}px`,
        "background-color": this.color[this.cellData[i - 1]?.[j - 1]]
      };
    },
    calculateCellProp(p1: number[], p2: number[]) {
      let x0 = p1[0];
      let x1 = p2[0];
      let y0 = p1[1];
      let y1 = p2[1];
      if (x0 > x1) [x0, x1] = [x1, x0];
      if (y0 > y1) [y0, y1] = [y1, y0];
      const prop = {
        top: (x0 - 1) * +this.size - x0,
        left: (y0 - 1) * +this.size - y0,
        height: (x1 - x0 + 1) * +this.size - (x1 - x0),
        width: (y1 - y0 + 1) * +this.size - (y1 - y0)
      };
      return prop;
    },
    async undoPlacement() {
      if (this.lastStep.length <= 0) {
        return;
      }
      this.nextStep.push(JSON.stringify(this.cellPlacement));
      this.undo = true;
      await this.$nextTick();
      const lastStep = this.lastStep.pop() || "[]";
      this.$set(this, "cellPlacement", JSON.parse(lastStep));
      await this.$nextTick();
      this.undo = false;
    },
    async redoPlacement() {
      if (this.nextStep.length <= 0) {
        return;
      }
      this.redo = true;
      await this.$nextTick();
      this.$set(this, "cellPlacement", JSON.parse(this.nextStep.pop() || "[]"));
      await this.$nextTick();
      this.redo = false;
    }
  },
  watch: {
    hoveringCell() {
      if (this.hoveringCell[0] == -1) {
        this.$emit("hoveringRange", null);
        return;
      }
      if (
        this.findPlacement(this.hoveringCell[0], this.hoveringCell[1])?.text ==
        "P"
      ) {
        const prop = this.calculateCellProp(
          [this.hoveringCell[0] - 4, this.hoveringCell[1] - 4],
          [this.hoveringCell[0] + 4, this.hoveringCell[1] + 4]
        );
        this.$emit("hoveringRange", {
          top: `${prop.top}px`,
          left: `${prop.left}px`,
          width: `${prop.width}px`,
          height: `${prop.height}px`
        });
      }
    },
    stringifyCellPlacement(val, old) {
      if (!this.undo) {
        this.lastStep.push(old);
      }
      if (!this.undo && !this.redo) {
        this.$set(this, "nextStep", []);
      }
    },
    cellPlacement() {
      localStorage.setItem("storedSetup", JSON.stringify(this.cellPlacement));
      const collectorRange = this.cellPlacement
        .filter(p => p.text == "C" || p.text == "D")
        .map(placement => {
          const prop = this.calculateCellProp(
            [placement.x - 2, placement.y - 2],
            [placement.x + 2, placement.y + 2]
          );
          return {
            top: `${prop.top}px`,
            left: `${prop.left}px`,
            width: `${prop.width}px`,
            height: `${prop.height}px`,
            _seed: placement.color
          };
        });
      this.$emit("collectorRange", collectorRange);
      const placementStyle = this.cellPlacement.map(placement => {
        const prop = this.calculateCellProp(
          [placement.x, placement.y],
          [placement.x, placement.y]
        );
        return {
          top: `${prop.top}px`,
          left: `${prop.left}px`,
          width: `${prop.width}px`,
          height: `${prop.height}px`,
          ...this.cellObjectStyle(placement.x, placement.y),
          _text: this.cellText(placement.x, placement.y)
        };
      });
      this.$emit("placementStyle", placementStyle);
    },
    selectingCell() {
      const prop = this.calculateCellProp(
        this.selectingCell[0],
        this.selectingCell[1]
      );
      this.$emit("selectedStyle", {
        top: `${prop.top}px`,
        left: `${prop.left}px`,
        width: `${prop.width}px`,
        height: `${prop.height}px`
      });
    }
  },
  computed: {
    stringifyCellPlacement(): string {
      return JSON.stringify(this.cellPlacement);
    },
    isAnySelected(): boolean {
      return this.selectedCell[0][0] == -1;
    },
    selectionOutline() {
      return {};
    },
    hoverOutline() {
      return {};
    }
  }
});
</script>

<style scoped>
div {
  display: inline-block;
}
.cell {
  user-select: none;
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  position: absolute;
  transition: background-color 0.2s;
}
.hoverable-cell::after {
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  content: " ";
  transition: background-color 0.2s;
  z-index: 3;
}
.hoverable-cell:hover::after {
  background-color: rgba(128, 128, 128, 0.5);
}
.selected-cell {
  z-index: 2;
  border: none;
}
.cell-text {
  display: inline-block;
}
</style>

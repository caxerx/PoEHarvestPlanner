<template>
  <div @mousedown="selectStart" @mouseup="selectStop" @contextmenu.prevent>
    <template v-for="i in row">
      <div
        v-for="j in column"
        :style="cellStyle(i, j)"
        :key="`column-${i}-${j}`"
        class="cell-selection"
        @mouseenter="cellHovered(i, j)"
        @mouseleave="cellLeaved(i, j)"
      ></div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "@/layout/harvest-layout.json";
import { calculateCellPosition } from "@/utils/cell-calc";

export default Vue.extend({
  name: "GridSelection",
  props: {
    value: {
      type: Array,
      default: (): number[][] => []
    },
    connecting: {
      type: Array,
      default: (): number[][] => []
    },
    hovering: {
      type: Array,
      default: (): number[] => []
    },
    selection: {},
    connection: {},
    size: { type: [Number], default: 20 },
    row: { type: [Number], default: 42 },
    column: { type: [Number], default: 42 }
  },
  created() {
    document.addEventListener("keyup", this.selectAllListener);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.selectAllListener);
  },
  data() {
    return {
      cellData: Layout,
      selectionMode: false,
      connectionMode: false,
      hoveringCell: [-1, -1],
      selectingArea: [
        [-1, -1],
        [-1, -1]
      ],
      connectionPoint: [[-1, -1]]
    };
  },
  methods: {
    async selectStart(evt: MouseEvent) {
      this.$set(this.selectingArea, 0, this.hoveringCell);
      this.$set(this.selectingArea, 1, this.hoveringCell);
      if (evt.button == 0) {
        this.selectionMode = true;
      }
      if (evt.button == 2) {
        this.$set(this.connectionPoint, 0, this.hoveringCell);
        this.$set(this.connectionPoint, 1, this.hoveringCell);
        this.connectionMode = true;
      }
    },
    async selectStop(evt: MouseEvent) {
      if (evt.button == 0) {
        this.selectionMode = false;
      }
      if (evt.button == 2) {
        this.connectionMode = false;
      }
    },
    async cellHovered(i: number, j: number) {
      this.$set(this, "hoveringCell", [i, j]);
      if (this.selectionMode) {
        this.$set(this.selectingArea, 1, [i, j]);
      }
      if (this.connectionMode) {
        this.$set(this.connectionPoint, 1, [i, j]);
      }
    },
    async cellLeaved() {
      this.$set(this, "hoveringCell", [-1, -1]);
    },
    selectAllListener(e: KeyboardEvent) {
      if (e.keyCode == 65 && e.ctrlKey) {
        this.$set(this, "selectingArea", [
          [1, 1],
          [this.row, this.column]
        ]);
        this.$emit("update:selection", this.selectingArea);
      }
    },
    cellStyle(i: number, j: number) {
      const [xPos, yPos] = calculateCellPosition([i, j], this.size);
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
        top: `${xPos}px`,
        left: `${yPos}px`
      };
    }
  },
  watch: {
    hoveringCell(val) {
      this.$emit("update:hovering", val);
    },
    value(val) {
      this.$set(this, "selectingArea", val);
    },
    selectingArea() {
      this.$emit("input", this.selectingArea);
    },
    connecting(val) {
      this.$set(this, "connectionPoint", val);
    },
    connectionPoint() {
      this.$emit("update:connecting", this.connectionPoint);
    },
    selectionMode(val) {
      if (!val) {
        this.$emit("update:selection", this.selectingArea);
      }
    },
    connectionMode(val) {
      if (!val) {
        this.$emit("update:connection", this.connectionPoint);
      }
    }
  }
});
</script>

<style scoped>
.cell-selection {
  user-select: none;
  margin: 0;
  padding: 0;
  position: absolute;
  z-index: 10;
}
.cell-selection:hover {
  background-color: rgba(75, 75, 75, 0.7);
}
</style>

<template>
  <div :style="elementStyle">
    <template v-for="i in row">
      <div v-for="j in column" :style="cellStyle(i, j)" :key="`column-${i}-${j}`" class="cell"></div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "@/layout/harvest-layout.json";
import { calculateCellPosition, calculateAreaPixelSize } from "@/utils/cell-calc";

export default Vue.extend({
  name: "GridDisplay",
  props: {
    size: { type: [Number], default: 20 },
    row: { type: [Number], default: 42 },
    column: { type: [Number], default: 42 }
  },
  data() {
    return {
      cellData: Layout,
      color: [null, "green", "pink", "blue", "brown"]
    };
  },
  computed: {
    elementStyle() {
      const size = calculateAreaPixelSize(
        [
          [1, 1],
          [this.row, this.column]
        ],
        this.size
      );
      return {
        height: `${size[0]}px`,
        width: `${size[1]}px`
      };
    }
  },
  methods: {
    cellStyle(i: number, j: number) {
      const [xPos, yPos] = calculateCellPosition([i, j], this.size);
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
        top: `${xPos}px`,
        left: `${yPos}px`,
        "background-color": this.color[this.cellData[i - 1]?.[j - 1]]
      };
    }
  }
});
</script>

<style scoped>
.cell {
  pointer-events: none;
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  position: absolute;
  user-select: none;
  z-index: 1;
}
</style>

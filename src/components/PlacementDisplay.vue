<template>
  <div>
    <div
      v-for="(p, index) in placement"
      :style="cellStyle(p)"
      :key="`placement-${index}`"
      class="placement-cell"
    >
      <div>{{ p.text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Layout from "@/layout/harvest-layout.json";
import { calculateCellPosition } from "@/utils/cell-calc";
import { CellPlacement } from "@/types/CellPlacement";

export default Vue.extend({
  name: "PlacementDisplay",
  props: {
    size: { type: [Number], default: 20 },
    placement: {}
  },
  data() {
    return {
      cellData: Layout,
      backgroundColor: ["#9C27B0", "#F57F17", "#2196F3"]
    };
  },
  methods: {
    cellStyle(placement: CellPlacement) {
      const [xPos, yPos] = calculateCellPosition(
        [+placement.x, +placement.y],
        this.size
      );
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
        top: `${xPos}px`,
        left: `${yPos}px`,
        "background-color": this.backgroundColor[placement.color ?? -1]
      };
    }
  }
});
</script>

<style scoped>
.placement-cell {
  pointer-events: none;
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  position: absolute;
  user-select: none;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

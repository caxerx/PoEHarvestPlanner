<template>
  <div :style="selectionStyle()" class="selection" v-if="selection[0]"></div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  calculateCellPosition,
  calculateAreaPixelSize,
  findAreaTopLeft
} from "@/utils/cell-calc";
export default Vue.extend({
  name: "GridSelectArea",
  props: {
    size: { type: [Number], default: 20 },
    selection: {
      default: (): number[][] => []
    }
  },
  methods: {
    selectionStyle() {
      const topLeft = findAreaTopLeft(this.selection);
      const [xPos, yPos] = calculateCellPosition(topLeft, this.size);
      const [height, width] = calculateAreaPixelSize(this.selection, this.size);
      return {
        height: `${height}px`,
        width: `${width}px`,
        top: `${xPos}px`,
        left: `${yPos}px`
      };
    }
  }
});
</script>
<style scoped>
.selection {
  border: 2px solid red;
  box-shadow: 0px 0px 4px red;
  z-index: 10;
  pointer-events: none;
  user-select: none;
  position: absolute;
}
</style>

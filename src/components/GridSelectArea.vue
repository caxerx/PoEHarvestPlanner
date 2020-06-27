<template>
  <div style="position:absolute">
    <div :style="selectionStyle()" class="selection" v-if="selection[0]"></div>
    <div :style="hoveringStyle()" class="hovering" v-if="linkHovering[0]"></div>
    <div
      v-for="(ia, i) in inferenceArea"
      :key="`infa-${i}`"
      :style="inferenceAreaStyle(ia)"
      class="inference-area"
    ></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { calculateCellPosition, calculateAreaPixelSize, findAreaTopLeft } from "@/utils/cell-calc";
import { InferenceArea } from "../types/CellPlacement";
export default Vue.extend({
  name: "GridSelectArea",
  props: {
    size: { type: [Number], default: 20 },
    selection: {
      default: (): number[][] => []
    },
    linkHovering: {
      default: (): number[] => []
    },
    inferenceArea: {
      default: (): InferenceArea[] => []
    },
    backgroundAlpha: {
      default: 0.1
    }
  },
  data() {
    return {
      seed: ["1", "2", "3", "4"],
      seedColor: ["156, 39, 176", "245, 127, 23", "33, 150, 243", "255, 255, 255"]
    };
  },
  methods: {
    inferenceAreaStyle(ia: InferenceArea) {
      const [xPos, yPos] = calculateCellPosition(ia.topLeft, this.size);
      const [height, width] = calculateAreaPixelSize(
        [ia.topLeft, [ia.topLeft[0] + ia.size, ia.topLeft[1] + ia.size]],
        this.size
      );
      return {
        height: `${height}px`,
        width: `${width}px`,
        top: `${xPos}px`,
        left: `${yPos}px`,
        border: `2px solid rgba(${this.seedColor[ia.color ?? 3]}, ${this.backgroundAlpha + 0.3})`,
        "box-shadow": `0px 0px 4px rgba(${this.seedColor[ia.color ?? 3]}, ${this.backgroundAlpha + 0.3})`,
        "background-color": `rgba(${this.seedColor[ia.color ?? 3]}, ${this.backgroundAlpha})`
      };
    },
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
    },
    hoveringStyle() {
      const [xPos, yPos] = calculateCellPosition(this.linkHovering, this.size);
      return {
        height: `${this.size}px`,
        width: `${this.size}px`,
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
  z-index: 7;
  pointer-events: none;
  position: absolute;
}

.hovering {
  border: 2px solid pink;
  box-shadow: 0px 0px 4px pink;
  z-index: 7;
  pointer-events: none;
  position: absolute;
}

.inference-area {
  z-index: 6;
  pointer-events: none;
  position: absolute;
}
</style>

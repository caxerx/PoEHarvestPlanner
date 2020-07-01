<template>
  <div :style="svgDivStyle">
    <svg>
      <line v-bind="c" v-for="(c, i) in renderedConnection" :key="`connection-${i}`" />
    </svg>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { calculateAreaPixelSize } from "@/utils/style-utils";
import { LineAttributes } from "../types/PlacementRender";
export default Vue.extend({
  name: "GridConnection",
  computed: {
    renderedConnection(): LineAttributes[] {
      return this.$store.getters.renderedConnection;
    },
    svgDivStyle(): object {
      const size = calculateAreaPixelSize(
        [
          [1, 1],
          [42, 42]
        ],
        20
      );
      return {
        height: `${size[0]}px`,
        width: `${size[1]}px`
      };
    }
  }
});
</script>
<style scoped>
svg {
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: 8;
  top: 0;
  left: 0;
  position: absolute;
}
</style>

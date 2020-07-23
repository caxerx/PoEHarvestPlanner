<template>
  <div>
    <svg style="width:100%; height:100%" v-if="isConnecting">
      <defs>
        <mask id="placementMask">
          <rect width="100%" height="100%" fill="white"></rect>
          <rect
            v-for="(c, i) in renderedConnectablePlacement"
            :key="`connectable-mask-${i}`"
            v-bind="c"
            fill="black"
          ></rect>
        </mask>
      </defs>
      <rect width="100%" height="100%" mask="url(#placementMask)" fill="black"></rect>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlacementMask } from "../types/PlacementRender";
export default Vue.extend({
  name: "ConnectionFilter",
  computed: {
    isConnecting() {
      return this.$store.getters.isConnecting;
    },
    renderedConnectablePlacement(): PlacementMask[] {
      return this.$store.getters.renderedConnectablePlacement;
    }
  }
});
</script>
<style scoped>
svg {
  opacity: 0.5;
}
</style>

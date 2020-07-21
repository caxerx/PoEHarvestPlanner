<template>
  <div>
    <div
      v-for="(p, index) in renderedPlacement"
      :style="p.cellStyle"
      :key="`placement-${index}`"
      class="placement-cell"
    >
      <div class="placement-text" :style="p.textStyle">{{ p.text }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlacementRender } from "../types/PlacementRender";

export default Vue.extend({
  name: "PlacementDisplay",
  computed: {
    renderedPlacement(): PlacementRender[] {
      return this.$store.getters.renderedPlacement;
    }
  }
});
</script>

<style scoped>
.placement-text {
  position: relative;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  /* transform: rotate(45deg); */
}
.placement-cell {
  pointer-events: none;
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unavailable-cell {
  opacity: 0.5 !important;
}
</style>

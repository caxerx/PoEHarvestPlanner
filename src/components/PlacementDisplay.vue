<template>
  <div>
    <div
      v-for="(p, index) in renderedPlacement"
      :style="p.cellStyle"
      :key="`placement-${index}`"
      class="placement-cell"
    >
      <div :class="{ 'placement-text': true, rotate: rotate }" :style="p.textStyle">{{ p.text }}</div>
    </div>

    <div
      v-for="(p, index) in renderedHoveringPlacement"
      :style="p.cellStyle"
      :key="`placement-hovering-${index}`"
      class="placement-cell"
    >
      <div :class="{ 'placement-text': true, 'placement-override-text': true, rotate: rotate }" :style="p.textStyle">
        {{ p.text }}
      </div>
    </div>

    <div
      v-for="(p, index) in renderedSelectingPlacement"
      :style="p.cellStyle"
      :key="`placement-selecting-${index}`"
      class="placement-cell"
    >
      <div :class="{ 'placement-text': true, 'placement-override-text': true, rotate: rotate }" :style="p.textStyle">
        {{ p.text }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlacementRender } from "../types/PlacementRender";
import { VisualSettings } from "../types/VisualSettings";

export default Vue.extend({
  name: "PlacementDisplay",
  computed: {
    rotate(): boolean {
      return (this.$store.getters.settings as VisualSettings).rotate;
    },
    renderedPlacement(): PlacementRender[] {
      return this.$store.getters.renderedPlacement;
    },
    renderedHoveringPlacement(): PlacementRender[] {
      return this.$store.getters.renderedHoveringPlacement;
    },
    renderedSelectingPlacement(): PlacementRender[] {
      return this.$store.getters.renderedSelectingPlacement;
    }
  }
});
</script>

<style scoped>
.placement-text {
  position: absolute;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

.placement-override-text {
  z-index: 9;
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

.rotate {
  transform: rotate(45deg);
}
</style>

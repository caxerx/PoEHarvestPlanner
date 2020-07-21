<template>
  <svg>
    <line v-bind="c" v-for="(c, i) in renderedConnection" :key="`connection-${i}`" />
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { LineAttributes } from "../types/PlacementRender";
export default Vue.extend({
  name: "GridConnection",
  computed: {
    renderedConnection(): LineAttributes[] {
      return this.$store.getters.renderedConnection;
    }
  }
});
</script>
<style scoped>
svg {
  pointer-events: none;
  z-index: 8;
  top: 0;
  left: 0;
  position: absolute;
}
</style>

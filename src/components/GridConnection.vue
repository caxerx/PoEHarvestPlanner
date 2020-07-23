<template>
  <svg>
    <line v-bind="c" v-for="(c, i) in renderedConnection" :key="`connection-${i}`" />
    <line v-bind="c" v-for="(c, i) in renderedSelectingConnection" :key="`selecting-connection-${i}`" />
    <line v-bind="c" v-for="(c, i) in renderedHoveringConnection" :key="`hovering-connection-${i}`" />
    <line v-bind="c" v-for="(c, i) in renderedConnectingConnection" :key="`connecting-connection-${i}`" />
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
    },
    renderedSelectingConnection(): LineAttributes[] {
      return this.$store.getters.renderedSelectingConnection;
    },
    renderedHoveringConnection(): LineAttributes[] {
      return this.$store.getters.renderedHoveringConnection;
    },
    renderedConnectingConnection(): LineAttributes[] {
      return this.$store.getters.renderedConnectingConnection;
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

<template>
  <div style="position:absolute">
    <div :style="renderedSelectionArea" class="selection" v-if="renderedSelectionArea"></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "GridSelectArea",
  computed: {
    renderedSelectionArea(): CSSStyleDeclaration {
      return this.$store.getters.renderedSelectionArea;
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
</style>

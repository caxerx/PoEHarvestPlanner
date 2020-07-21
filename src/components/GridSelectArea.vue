<template>
  <div style="position:absolute">
    <div :style="renderedSelectionArea" class="area selection" v-if="renderedSelectionArea"></div>
    <div v-for="(a, i) in renderedInferenceArea" :key="i" :style="a" class="area inference"></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "GridSelectArea",
  computed: {
    renderedSelectionArea(): CSSStyleDeclaration {
      return this.$store.getters.renderedSelectionArea;
    },
    renderedInferenceArea(): CSSStyleDeclaration {
      return this.$store.getters.renderedInferenceArea;
    }
  }
});
</script>
<style scoped>
.selection {
  z-index: 10;
  border: 2px solid red;
  box-shadow: 0px 0px 4px red;
}

.inference {
  z-index: 7;
}

.area {
  pointer-events: none;
  position: absolute;
}
</style>

<template>
  <div>
    <div :style="renderedSelectionArea" class="area selection" v-if="renderedSelectionArea"></div>
    <div :style="renderedHoveringInferenceArea" class="area inference" v-if="renderedHoveringInferenceArea"></div>
    <div :style="renderedSelectingInferenceArea" class="area inference" v-if="renderedSelectingInferenceArea"></div>
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
    renderedHoveringInferenceArea(): CSSStyleDeclaration {
      return this.$store.getters.renderedHoveringInferenceArea;
    },
    renderedSelectingInferenceArea(): CSSStyleDeclaration {
      return this.$store.getters.renderedSelectingInferenceArea;
    },
    renderedInferenceArea(): CSSStyleDeclaration[] {
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
  z-index: 8;
}

.area {
  pointer-events: none;
  position: absolute;
}
</style>

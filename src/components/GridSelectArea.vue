<template>
  <div>
    <div :style="renderedSelectionArea" class="area selection" v-if="renderedSelectionArea"></div>
    <div :style="renderedHoveringInfluenceArea" class="area influence" v-if="renderedHoveringInfluenceArea"></div>
    <div :style="renderedSelectingInfluenceArea" class="area influence" v-if="renderedSelectingInfluenceArea"></div>
    <div v-for="(a, i) in renderedInfluenceArea" :key="i" :style="a" class="area influence"></div>
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
    renderedHoveringInfluenceArea(): CSSStyleDeclaration {
      return this.$store.getters.renderedHoveringInfluenceArea;
    },
    renderedSelectingInfluenceArea(): CSSStyleDeclaration {
      return this.$store.getters.renderedSelectingInfluenceArea;
    },
    renderedInfluenceArea(): CSSStyleDeclaration[] {
      return this.$store.getters.renderedInfluenceArea;
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

.influence {
  z-index: 8;
}

.area {
  pointer-events: none;
  position: absolute;
}
</style>

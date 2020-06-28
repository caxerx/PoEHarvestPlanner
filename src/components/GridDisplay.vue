<template>
  <div>
    <template v-for="(column, x) in cellStyle">
      <div v-for="(row, y) in column" :style="row" :key="`cell-${x}-${y}`" class="cell"></div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "GridDisplay",
  computed: {
    cellStyle() {
      return this.$store.getters.cellStyle;
    }
  }
});
</script>

<style scoped>
div {
  position: relative;
}

.cell {
  pointer-events: none;
  border: 1px solid rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  position: absolute;
  z-index: 1;
}
</style>

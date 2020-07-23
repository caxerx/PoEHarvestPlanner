<template>
  <div>
    <div :class="{ filter: true, darken: isConnecting }"></div>
    <div
      class="lighten"
      v-for="(c, i) in renderedConnectablePlacement"
      :style="c"
      :key="`connectable-filter-${i}`"
    ></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "ConnectionFilter",
  computed: {
    isConnecting() {
      return this.$store.getters.isConnecting;
    },
    renderedConnectablePlacement() {
      return this.$store.getters.renderedConnectablePlacement;
    }
  }
});
</script>

<style scoped>
.lighten {
  backdrop-filter: brightness(2);
  position: absolute;
  z-index: 2;
}

.filter {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}
.darken {
  backdrop-filter: brightness(0.5);
}
</style>

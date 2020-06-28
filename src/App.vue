<template>
  <router-view></router-view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "App",
  created() {
    document.addEventListener("keyup", this.keyboardListener);
  },
  beforeDestroy() {
    document.removeEventListener("keyup", this.keyboardListener);
  },
  data() {
    return {
      disablePlacementShortcout: false
    };
  },
  methods: {
    keyboardListener(e: KeyboardEvent) {
      if (this.disablePlacementShortcout) {
        return;
      }

      //Ctrl + A
      if (e.keyCode == 65 && e.ctrlKey) {
        this.$store.dispatch("keyboardCtrlAPressed");
      }

      if (e.keyCode == 27) {
        this.$store.dispatch("keyboardEscPressed");
      }
    }
  }
});
</script>
<style>
html {
  user-select: none;
}
</style>

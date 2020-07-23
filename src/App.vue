<template>
  <router-view></router-view>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "App",
  created() {
    document.addEventListener("keydown", this.keydownListener);
    document.addEventListener("keyup", this.keyboardListener);
  },
  beforeDestroy() {
    document.removeEventListener("keydown", this.keydownListener);
    document.removeEventListener("keyup", this.keyboardListener);
  },
  data() {
    return {
      disablePlacementShortcout: false
    };
  },
  methods: {
    keydownListener(e: KeyboardEvent) {
      if (this.disablePlacementShortcout) {
        return;
      }

      if (e.code == "ControlLeft" || e.code == "ControlRight") {
        this.$store.dispatch("keyboardCtrlDown");
      }

      if (e.code == "ArrowUp") {
        //
      }
    },
    keyboardListener(e: KeyboardEvent) {
      if (this.disablePlacementShortcout) {
        return;
      }

      if (e.code == "ControlLeft" || e.code == "ControlRight") {
        this.$store.dispatch("keyboardCtrlUp");
      }

      if (e.code == "KeyA" && e.ctrlKey) {
        this.$store.dispatch("keyboardCtrlAPressed");
      }

      if (e.code == "Escape") {
        this.$store.dispatch("keyboardEscPressed");
      }
    }
  }
});
</script>
<style>
html {
  user-select: none;
  background: #121212;
}
</style>

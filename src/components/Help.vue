<template>
  <div>
    <component :is="details ? 'v-subheader' : 'v-subheader'" v-for="(text, i) in shortcut" :key="i">
      {{ text }}
    </component>
    <template v-if="details">
      <v-divider class="my-2"></v-divider>
      <v-subheader> PoEHarvestPlanner Build #{{ buildNumber }} ({{ gitHash }}) </v-subheader>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Help",
  props: {
    details: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      buildNumber: process.env.VUE_APP_BUILD_NUMBER,
      gitHash: process.env.VUE_APP_GIT_HASH,
      shortcut: [
        "Right Click and drag: Connect Pylon",
        "Ctrl + A: Select All",
        "Ctrl + Z: Undo",
        "Esc: Cancel Select",
        "Delete: Delete Selected Item",
        "Arrow Key: Move Selection Area (1 cell)",
        "Shift + Arrow Key: Move Selection Area (5 cell)",
        "Alt : Change Selected Color",
        "P / D / S / C / H / 1 / 2 / 3 / 4 : Place Element to Selected Area"
      ]
    };
  }
});
</script>

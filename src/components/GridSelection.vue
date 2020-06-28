<template>
  <div @mousedown="selectStart" @mouseup="selectStop" @contextmenu.prevent>
    <template v-for="(column, x) in selectionStyle">
      <div
        v-for="(row, y) in column"
        :style="selectionStyle[x][y]"
        :key="`selection-${x}-${y}`"
        class="cell-selection"
        @mouseenter="cellHovered(x + 1, y + 1)"
        @mouseleave="cellLeaved(x + 1, y + 1)"
      ></div>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "GridSelection",
  computed: {
    selectionStyle(): CSSStyleDeclaration[][] {
      return this.$store.getters.selectionStyle;
    },
    isDragging(): boolean {
      return this.$store.getters.isDragging;
    },
    isConnecting(): boolean {
      return this.$store.getters.isConnecting;
    }
  },
  methods: {
    cellHovered(x: number, y: number) {
      this.$store.dispatch("cellHovered", { x, y });
    },
    cellLeaved() {
      this.$store.dispatch("cellLeaved");
    },
    async selectStart(evt: MouseEvent) {
      if (evt.ctrlKey) {
        if (evt.button == 2) {
          this.$store.dispatch("cellCtrlRightClicked");
        }
        return;
      }

      if (evt.button == 0) {
        this.$store.dispatch("cellLeftDown");
      }
      if (evt.button == 2) {
        this.$store.dispatch("cellRightDown");
      }
    },
    async selectStop(evt: MouseEvent) {
      if (evt.button == 0) {
        this.$store.dispatch("cellLeftUp");
      }
      if (evt.button == 2) {
        this.$store.dispatch("cellRightUp");
      }
    }
  }
});
</script>

<style scoped>
.cell-selection {
  margin: 0;
  padding: 0;
  position: absolute;
  z-index: 10;
}
.cell-selection:hover {
  background-color: rgba(75, 75, 75, 0.7);
}
</style>

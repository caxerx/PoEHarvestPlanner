<template>
  <v-app>
    <v-navigation-drawer app width="300" permanent v-if="showDrawer">
      <DrawerPlacementSelection></DrawerPlacementSelection>
    </v-navigation-drawer>

    <v-app-bar app style="z-index: 100"></v-app-bar>

    <v-main>
      <v-row>
        <v-col class="ml-5 mt-2">
          <div class="display-container">
            <GridSelection :style="divStyle"></GridSelection>
            <GridDisplay class="no-select" :style="divStyle"></GridDisplay>
            <PlacementDisplay class="no-select" :style="divStyle"></PlacementDisplay>
            <GridConnection class="no-select" :style="divStyle"></GridConnection>
            <GridSelectArea class="no-select" :style="divStyle"></GridSelectArea>
            <ConnectionFilter class="no-select" :style="divStyle"></ConnectionFilter>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>
<script lang="ts">
import Vue from "vue";
import GridDisplay from "@/components/GridDisplay.vue";
import GridSelection from "@/components/GridSelection.vue";
import GridSelectArea from "@/components/GridSelectArea.vue";
import DrawerPlacementSelection from "@/components/DrawerPlacementSelection.vue";
import GridConnection from "@/components/GridConnection.vue";
import PlacementDisplay from "@/components/PlacementDisplay.vue";
import ConnectionFilter from "@/components/ConnectionFilter.vue";
import { calculateAreaPixelSize } from "@/utils/style-utils";
import { VisualSettings } from "./types/VisualSettings";

export default Vue.extend({
  props: {
    planData: {
      default: ""
    }
  },
  name: "Main",
  components: {
    GridDisplay,
    GridSelection,
    GridSelectArea,
    DrawerPlacementSelection,
    GridConnection,
    PlacementDisplay,
    ConnectionFilter
  },
  data() {
    return {
      showDrawer: true
    };
  },
  computed: {
    rotate(): boolean {
      return (this.$store.getters.settings as VisualSettings).rotate;
    },
    divStyle(): CSSStyleDeclaration {
      const size = calculateAreaPixelSize(
        [
          [1, 1],
          [42, 42]
        ],
        20
      );
      const style = {
        position: "absolute",
        height: `${size[0]}px`,
        width: `${size[1]}px`
      } as CSSStyleDeclaration;

      if (this.rotate) {
        style.margin = `${(Math.sqrt(size[0] ** 2 + size[1] ** 2) - size[0]) / 2}px`;
        style.transform = "rotate(-45deg)";
      }

      return style;
    }
  },
  watch: {
    planData: {
      immediate: true,
      async handler(val) {
        this.$store.dispatch("setPlacementFromShare", val);
      }
    }
  }
});
</script>
<style scoped>
.display-container {
  position: relative;
}

.no-select {
  user-select: none;
  pointer-events: none;
}
</style>

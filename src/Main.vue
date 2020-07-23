<template>
  <v-app>
    <v-navigation-drawer app width="300" permanent>
      <DrawerPlacementSelection></DrawerPlacementSelection>
    </v-navigation-drawer>

    <v-app-bar app style="z-index: 100"> </v-app-bar>

    <v-main>
      <v-row>
        <v-col class="ml-5 mt-2">
          <div class="display-container">
            <ConnectionFilter class="rotate no-select" :style="divStyle"></ConnectionFilter>
            <GridSelection class="rotate" :style="divStyle"></GridSelection>
            <GridSelectArea class="rotate no-select" :style="divStyle"></GridSelectArea>
            <GridConnection class="rotate no-select" :style="divStyle"></GridConnection>
            <GridDisplay class="rotate no-select" :style="divStyle"></GridDisplay>
            <PlacementDisplay class="rotate no-select" :style="divStyle"></PlacementDisplay>
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
  computed: {
    divStyle(): object {
      const size = calculateAreaPixelSize(
        [
          [1, 1],
          [42, 42]
        ],
        20
      );
      return {
        position: "absolute",
        height: `${size[0]}px`,
        width: `${size[1]}px`
        // margin: `${(Math.sqrt(size[0] ** 2 + size[1] ** 2) - size[0]) / 2}px`
      };
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

/* .rotate {
  transform: rotate(-45deg);
} */
</style>

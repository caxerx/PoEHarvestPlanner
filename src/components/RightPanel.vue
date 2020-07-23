<template>
  <div v-if="selectedPlacement.length > 0">
    <v-subheader>
      Selected
      <v-spacer></v-spacer>
      <v-btn text @click="clearPlacement">Clear</v-btn>
    </v-subheader>
    <v-card>
      <v-virtual-scroll :bench="1" :items="selectedPlacement" :height="isSingleSelection ? 60 : 600" :item-height="60">
        <template v-slot="{ item }">
          <v-list-item dense @mouseover="hoverLinkItem([item.x, item.y])" @mouseleave="hoverLinkItem(null)" link>
            <v-list-item-content>
              <v-list-item-title :class="`${getPlacementTextColor(item, textColor)}--text`">{{
                getPlacementFullName(item)
              }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="removePlacement(item.x, item.y)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-card>
  </div>
  <div v-else>
    <Help></Help>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Help from "@/components/Help.vue";
import { getPlacementFullName, getPlacementTextColor } from "../utils/placement-util";

export default Vue.extend({
  name: "RightPanel",
  components: {
    Help
  },
  computed: {
    isSingleSelection() {
      return this.$store.getters.isSingleSelection;
    },
    selectedPlacement() {
      return this.$store.getters.selectedPlacement;
    },
    textColor() {
      return this.$store.getters.textColor;
    }
  },
  methods: {
    getPlacementFullName,
    getPlacementTextColor,
    clearPlacement() {
      //
    },
    hoverLinkItem() {
      //
    },
    setPlacementColor() {
      //
    },
    removePlacement() {
      //
    }
  }
});
</script>

<template>
  <div>
    <v-item-group multiple v-for="(g, gIndex) in drawerGroup" :key="`gp-${gIndex}`">
      <v-subheader>
        {{ g.label }}
      </v-subheader>
      <v-row class="mx-2">
        <v-col v-for="(i, iIndex) in g.item" :key="`gi-${iIndex}`">
          <v-btn
            :color="i.color"
            :height="60"
            width="60"
            @click="placeItem(g.type, i.color)"
            :class="iIndex == selectedColor ? `select-color` : null"
          >
            <v-img :src="i.image"></v-img>
          </v-btn>
        </v-col>
      </v-row>
    </v-item-group>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "DrawerPlacementSelection",
  methods: {
    keyboardListener(e: KeyboardEvent) {
      if (this.disablePlacementShortcut || e.ctrlKey) {
        return;
      }
      if (e.keyCode == 18) {
        e.preventDefault();
        this.selectedColor = (this.selectedColor + 1) % 3;
        return;
      }
      if (e.keyCode == 81) {
        e.preventDefault();
        this.selectedColor = 0;
        return;
      }
      if (e.keyCode == 87) {
        e.preventDefault();
        this.selectedColor = 1;
        return;
      }
      if (e.keyCode == 69) {
        e.preventDefault();
        this.selectedColor = 2;
        return;
      }
      if (this.keyAllow.includes(e.keyCode)) {
        this.placeItem(this.keyMap[`${e.keyCode}`], this.color[this.selectedColor]);
      }
    },
    placeItem(type: string, color: string) {
      this.$emit("place", [type, this.color.indexOf(color)]);
    }
  },
  created() {
    window.addEventListener("keyup", this.keyboardListener);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.keyboardListener);
  },
  data() {
    return {
      disablePlacementShortcut: false,
      keyAllow: [80, 68, 83, 67, 49, 50, 51, 52, 72],
      keyMap: {
        "80": "P",
        "68": "D",
        "83": "S",
        "67": "C",
        "49": "1",
        "50": "2",
        "51": "3",
        "52": "4",
        "72": "H"
      } as Record<string, string>,
      color: ["purple", "yellow", "blue"],
      selectedColor: 0,
      drawerGroup: [
        {
          label: "Pylon (P)",
          type: "P",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestPole.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestPole.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestPole.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Disperser (D)",
          type: "D",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestSprinkler.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestSprinkler.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestSprinkler.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Storage (S)",
          type: "S",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestStorage.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestStorage.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestStorage.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Collector (C)",
          type: "C",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestRedExtractor.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestGreenExtractor.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestBlueExtractor.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Tier 1 Seed (1)",
          type: "1",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/RedSeedTier1DropBear.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/YellowSeedTier1MeleeSpider.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/BlueSeedTier1Rhoa.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Tier 2 Seed (2)",
          type: "2",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/RedSeedTier2Beast.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/YellowSeedTier2SabreSpider.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/BlueSeedTier2Rhex.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Tier 3 Seed (3)",
          type: "3",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/RedSeedTier3Beast.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/YellowSeedTier3BlackSpider.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/BlueSeedTier3Rhex.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Tier 4 Seed (4)",
          type: "4",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/RedSeedBoss.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/YellowSeedBoss.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/BlueSeedBoss.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Horticrafting Station (H)",
          type: "H",
          item: [
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestWorkbench.png?scale=1",
              color: "purple"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestWorkbench.png?scale=1",
              color: "yellow"
            },
            {
              image: "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestWorkbench.png?scale=1",
              color: "blue"
            }
          ]
        }
      ]
    };
  }
});
</script>
<style scoped>
.select-color {
  border: 2px solid red !important;
  box-shadow: 0px 0px 4px red;
}
</style>

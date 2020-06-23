<template>
  <div>
    <v-item-group
      multiple
      v-for="(g, gIndex) in drawerGroup"
      :key="`gp-${gIndex}`"
    >
      <v-subheader>
        {{ g.label }}
      </v-subheader>
      <v-row class="mx-2">
        <v-col v-for="(i, iIndex) in g.item" :key="`gi-${iIndex}`">
          <v-btn
            :color="i.color"
            height="60"
            @click="placeItem(g.type, i.color)"
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
    placeItem(type: string, color: string) {
      this.$emit("place", [type, this.color.indexOf(color)]);
    }
  },
  data() {
    return {
      color: ["purple", "yellow", "blue"],
      drawerGroup: [
        {
          label: "Pylon",
          type: "P",
          item: [
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestPole.png?scale=1",
              color: "purple"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestPole.png?scale=1",
              color: "yellow"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestPole.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Disperser",
          type: "D",
          item: [
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestSprinkler.png?scale=1",
              color: "purple"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestSprinkler.png?scale=1",
              color: "yellow"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestSprinkler.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Storage",
          type: "S",
          item: [
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestStorage.png?scale=1",
              color: "purple"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestStorage.png?scale=1",
              color: "yellow"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestStorage.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Collector",
          type: "C",
          item: [
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestRedExtractor.png?scale=1",
              color: "purple"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestGreenExtractor.png?scale=1",
              color: "yellow"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/HarvestBlueExtractor.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Tier 1 Seed",
          type: "1",
          item: [
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/RedSeedTier1DropBear.png?scale=1",
              color: "purple"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/YellowSeedTier1MeleeSpider.png?scale=1",
              color: "yellow"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/BlueSeedTier1Rhoa.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Tier 2 Seed",
          type: "2",
          item: [
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/RedSeedTier2Beast.png?scale=1",
              color: "purple"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/YellowSeedTier2SabreSpider.png?scale=1",
              color: "yellow"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/BlueSeedTier2Rhex.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Tier 3 Seed",
          type: "3",
          item: [
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/RedSeedTier3Beast.png?scale=1",
              color: "purple"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/YellowSeedTier3BlackSpider.png?scale=1",
              color: "yellow"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/BlueSeedTier3Rhex.png?scale=1",
              color: "blue"
            }
          ]
        },
        {
          label: "Tier 4 Seed",
          type: "4",
          item: [
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/RedSeedBoss.png?scale=1",
              color: "purple"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/YellowSeedBoss.png?scale=1",
              color: "yellow"
            },
            {
              image:
                "https://web.poecdn.com/image/Art/2DItems/Currency/Harvest/BlueSeedBoss.png?scale=1",
              color: "blue"
            }
          ]
        }
      ]
    };
  }
});
</script>

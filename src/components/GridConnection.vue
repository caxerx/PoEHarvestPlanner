<template>
  <svg :style="svgElementStyle">
    <line
      v-bind="getConnectionStyle(c, true)"
      v-for="(c, i) in connections"
      :key="`connection-${i}`"
    />
    <line
      v-bind="getConnectionStyle(c, false)"
      v-for="(c, i) in connections"
      :key="`connection-border-${i}`"
    />
    <line
      style="stroke:rgb(0,0,0);stroke-width:4"
      v-bind="getConnectingLineStyle()"
      v-if="connecting[0] && connecting[1]"
    />
    <line
      style="stroke:rgb(255,0,0);stroke-width:2"
      v-bind="getConnectingLineStyle()"
      v-if="connecting[0] && connecting[1]"
    />
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import {
  calculateCellPosition,
  calculateAreaPixelSize
} from "@/utils/cell-calc";
import { CellPlacement } from "../types/CellPlacement";
export default Vue.extend({
  name: "GridConnection",
  props: {
    column: {
      default: 42
    },
    row: {
      default: 42
    },
    size: {
      type: Number,
      default: 20
    },
    connecting: {
      default: (): number[][] => []
    },
    connections: {
      default: (): CellPlacement[] => []
    },
    connectionAlpha: {
      default: 0.5
    },
    selectConntect: {
      default: (): CellPlacement[] => []
    }
  },
  data() {
    return {
      lineColor: ["#9C27B0", "#F57F17", "#2196F3"]
    };
  },
  computed: {
    svgElementStyle(): object {
      const size = calculateAreaPixelSize(
        [
          [1, 1],
          [this.row, this.column]
        ],
        this.size
      );
      return {
        height: `${size[0]}px`,
        width: `${size[1]}px`,
        "pointer-events": "none",
        "user-select": "none",
        "z-index": 8,
        top: 0,
        left: 0,
        position: "absolute"
      };
    }
  },
  methods: {
    getConnectionStyle(c: CellPlacement, isBorder?: boolean) {
      if (typeof c.x == "number" || typeof c.y == "number") {
        return;
      }
      const pos1 = calculateCellPosition([c.x[0], c.y[0]], this.size);
      const pos2 = calculateCellPosition([c.x[1], c.y[1]], this.size);
      return {
        y1: pos1[0] + this.size / 2,
        x1: pos1[1] + this.size / 2,
        y2: pos2[0] + this.size / 2,
        x2: pos2[1] + this.size / 2,
        opacity: this.selectConntect.find(
          sc => JSON.stringify(c) == JSON.stringify(sc)
        )
          ? 1
          : this.connectionAlpha,
        style: isBorder
          ? `stroke:black ;stroke-width:4`
          : `stroke:${this.lineColor[c.color ?? -1] ?? "red"};stroke-width:2`
      };
    },
    getConnectingLineStyle() {
      const pos1 = calculateCellPosition(this.connecting[0], this.size);
      const pos2 = calculateCellPosition(this.connecting[1], this.size);
      return {
        y1: pos1[0] + this.size / 2,
        x1: pos1[1] + this.size / 2,
        y2: pos2[0] + this.size / 2,
        x2: pos2[1] + this.size / 2
      };
    }
  }
});
</script>

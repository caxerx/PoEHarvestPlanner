<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Type</th>
          <th class="text-left">Wild</th>
          <th class="text-left">Vivid</th>
          <th class="text-left">Primal</th>
          <th class="text-left">Total</th>
          <th class="text-left">Life Force</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Pylon</td>
          <td>{{ overview.pylon.wild }}</td>
          <td>{{ overview.pylon.vivid }}</td>
          <td>{{ overview.pylon.primal }}</td>
          <td>{{ overview.pylon.total }}</td>
          <td>{{ overview.pylon.total * 10 }}</td>
        </tr>
        <tr>
          <td>Storage</td>
          <td>{{ overview.storage.wild }}</td>
          <td>{{ overview.storage.vivid }}</td>
          <td>{{ overview.storage.primal }}</td>
          <td>{{ overview.storage.total }}</td>
          <td>{{ overview.storage.total * 75 }}</td>
        </tr>
        <tr>
          <td>Disperser</td>
          <td>{{ overview.disperser.wild }}</td>
          <td>{{ overview.disperser.vivid }}</td>
          <td>{{ overview.disperser.primal }}</td>
          <td>{{ overview.disperser.total }}</td>
          <td>{{ overview.disperser.total * 30 }}</td>
        </tr>
        <tr>
          <td>Collector</td>
          <td>{{ overview.collector.wild }}</td>
          <td>{{ overview.collector.vivid }}</td>
          <td>{{ overview.collector.primal }}</td>
          <td>{{ overview.collector.total }}</td>
          <td>{{ overview.collector.total * 25 }}</td>
        </tr>
        <tr>
          <td>Horticrafting Station</td>
          <td>{{ overview.horticraftingStation.wild }}</td>
          <td>{{ overview.horticraftingStation.vivid }}</td>
          <td>{{ overview.horticraftingStation.primal }}</td>
          <td>{{ overview.horticraftingStation.total }}</td>
          <td>{{ overview.horticraftingStation.total * 1800 }}</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            {{
              overview.pylon.total * 10 +
                overview.disperser.total * 30 +
                overview.storage.total * 75 +
                overview.collector.total * 25 +
                overview.horticraftingStation.total * 1800
            }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "CountTable",
  props: {
    overview: {
      default: (): object => ({})
    }
  }
});
</script>

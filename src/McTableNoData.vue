<template>
  <div>
    <div v-if="searchItemsCount < 1" class="w3-container w3-yellow">
      <h4>... {{ props.noDataMessage }} ...</h4>
    </div>
    <div v-else>
      <h4>... {{ props.loadingDataMessage }} ...</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue"

interface TableNoDataPropsType {
  noDataMessage?: string;
  loadingDataMessage?: string;
}

const props = withDefaults(defineProps<TableNoDataPropsType>(), {
  noDataMessage     : "No data/records available to display",
  loadingDataMessage: "Loading... Unable to process data. Ensure that you're logged in",
})

const searchItemsCount = inject<number>("mcSearchItemsCount", 0)
</script>

<style scoped>

</style>

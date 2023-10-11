<template>
  <div>
    <div class="w3-bar">
      <div v-if="itemFrom > 0 && itemTo >= itemFrom && searchItemsCount >= itemTo">
        <span class="w3-text-black">Showing {{ itemFrom }} to {{ itemTo }} of {{ searchItemsCount }} entries </span>
        <span v-if="searchItemsCount < totalRecordsCount"> (filtered from {{ totalRecordsCount }} total entries) </span>
        <span class="w3-blue"><strong> [ Page {{ savedCurrentPage }} ]</strong></span>
      </div>
      <div v-else-if="itemFrom > 0 && searchItemsCount < dataTotal">
        <span class="w3-text-black">Filtered {{
            searchItemsCount
          }}, by '{{ searchKey }}', from current data-batch of {{
            dataTotal
          }} records [from page {{ startPage }} to {{ endPage }}] </span>
        <span v-if="searchItemsCount < totalRecordsCount"> (filtered from {{ totalRecordsCount }} total entries) </span>
        <span class="w3-blue"><strong> [ Page {{ savedCurrentPage }} ]</strong></span>
      </div>
      <div v-else>
        <span class="w3-text-black">No record(s) to display</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, unref } from "vue"

const dataTotal = inject<number>("mcDataTotal", 0)
const totalRecordsCount = inject<number>("mcTotalRecordsCount", 0)
const searchItemsCount = inject<number>("mcSearchItemsCount", 0)
const pageLimit = inject<number>("mcPageLimit", 10)
const savedCurrentPage = inject<number>("mcSavedCurrentPage", 1)
const startPage = inject<number>("mcStartPage", 1)
const endPage = inject<number>("mcEndPage", 1)
const searchKey = inject<string>("mcSearchKey", "")

// compute per page itemFrom and itemTo records/items
const cPageVal = computed<number>(() => {
  // set cPageVal within the page-range
  const cPage = unref(savedCurrentPage)
  const sPage = unref(startPage)
  const ePage = unref(endPage)
  if (cPage < sPage) {
    return sPage
  } else if (cPage > ePage) {
    return ePage
  } else {
    return cPage - sPage + 1
  }
})
const itemFrom = computed(() => (unref(pageLimit) * (cPageVal.value - 1)) + 1)
const itemTo = computed(() => {
  if (unref(searchItemsCount) < unref(pageLimit) * cPageVal.value) {
    return unref(searchItemsCount)
  }
  return (unref(pageLimit) * cPageVal.value)
})
</script>

<style scoped>

</style>

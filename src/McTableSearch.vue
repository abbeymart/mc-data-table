<template>
  <div>
    <label for="mc-table-search-key" hidden><span class="w3-text-black">Search</span></label>
    <input id="mc-table-search-key" v-model="searchKey" class="w3-input mc-bold-label" name="mc-table-search-key"
           placeholder="Enter Search Keywords" type="text" @keyup="updateSearchKey">
  </div>
</template>

<script setup lang="ts">
import { inject, unref } from "vue"
import type { SetSearchKey } from "./types";

const searchKey = inject<string>("mcSearchKey", "")
const setSearchKeyValue = inject<SetSearchKey>("mcSetSearchKeyValue")
// methods: set searchKey
const updateSearchKey = () => {
  setSearchKeyValue && setSearchKeyValue(unref(searchKey))
}
</script>

<style scoped>

</style>

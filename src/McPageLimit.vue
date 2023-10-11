<template>
  <div>
    <label v-if="labelOn" for="mc-page-limit-value"></label>
    <span>Show </span>
    <select id="mc-page-limit-value" v-model="pageLimit" class="w3-round"
            name="mc-page-limit-value" @change="updatePageLimit">
      <option v-for="(item, index) in pageLimits" :key="index" :value="item">
        {{ item }}
      </option>
    </select>
    <span> items</span>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, unref } from "vue";
import type { SetPageLimit } from "./types";

const labelOn = ref<boolean>(false)
const pageLimit = inject<number>("mcPageLimit", 10)
const pageLimits = inject<Array<number>>("mcPageLimits", [10, 20, 30, 50, 100, 200])
const setPageLimit = inject<SetPageLimit>("mcSetPageLimit")

// update pageLimit
const updatePageLimit = () => setPageLimit && setPageLimit(unref(pageLimit))
</script>

<style scoped>

</style>

<template>
  <a href="#" @click.prevent="itemTask(itemId)">
    {{ deleteLabel }} <i class="fa fa-times-circle"></i>
  </a>
</template>

<style>

</style>

<script setup lang="ts">
import { ref } from "vue";
import type { ItemTaskType, } from "../types";

interface DeletePropsType {
  itemTask: ItemTaskType;
  itemId: string;
  itemLabel?: string;
}

const props = withDefaults(defineProps<DeletePropsType>(), {
  itemLabel: "Delete",
})

const deleteLabel = ref(props.itemLabel)
</script>

<template>
  <a href="#" @click.prevent="itemTask(itemData)">
    {{ updateLabel }} <i class="fa fa-edit"></i>
  </a>
</template>

<style>

</style>

<script setup lang="ts">
import { ref } from "vue";
import type { ItemTaskType, ObjectType } from "../types";

interface UpdatePropsType {
  itemTask: ItemTaskType;
  itemData: ObjectType;
  itemLabel?: string;
}

const props = withDefaults(defineProps<UpdatePropsType>(), {
  itemLabel: "Update",
})

const updateLabel = ref(props.itemLabel)

</script>

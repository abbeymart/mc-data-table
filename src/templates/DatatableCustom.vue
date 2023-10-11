<template>
  <a href="#" @click.prevent="itemTask(itemData)">
    {{ customLabel }} <i :class="customStyle"></i>
  </a>
</template>

<style>

</style>

<script setup lang="ts">
import { ref } from "vue";
import type { ItemTaskType, ObjectType } from "../types";

interface CustomPropsType {
  itemTask: ItemTaskType;
  itemData: ObjectType;
  itemLabel?: string;
  itemType?: string;
}

const props = withDefaults(defineProps<CustomPropsType>(), {
  itemLabel: "Update",
  itemType : "info",
})

// style by itemType
const customLabel = ref(props.itemLabel || "Info")
const customStyle = ref("fa fa-info")
switch (props.itemType) {
  case "update":
    customStyle.value = "fa fa-edit"
    break;
  case "delete":
    customStyle.value = "fa fa-times-circle"
    break;
  case "info":
    customStyle.value = "fa fa-info"
    break;
  default:
    customStyle.value = "fa fa-info"
    break;
}

</script>

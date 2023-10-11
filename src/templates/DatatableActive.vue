<template>
  <td>
    <span v-if="isActive">{{ yesLabel }} <i class="fa fa-check"></i></span>
    <span v-else>{{ noLabel }} <i class="fa fa-power-off"></i></span>
  </td>
</template>
<style>

</style>

<script setup lang="ts">
import { ref } from "vue";

interface ActivePropsType {
  isActive?: boolean;
  activeLabel?: string;
  inActiveLabel?: string;
}

const props = withDefaults(defineProps<ActivePropsType>(), {
  isActive     : false,
  activeLabel  : "Yes",
  inActiveLabel: "No",
})

const yesLabel = ref(props.activeLabel)
const noLabel = ref(props.inActiveLabel)
</script>

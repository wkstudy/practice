<template>
  <div>{{ count }}</div>
  <div @click="handleClick">add</div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    let count = ref(0);
    const handleClick = () => count.value++;
    return {
      count,
      handleClick,
    };
  },
});
</script>

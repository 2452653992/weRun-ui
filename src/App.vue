<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<template>
  <HelloWorld msg="Vite + Vue" />
  <div class="test1">
    111
    <div class="test2">222</div>
  </div>
</template>

<style scoped lang="scss">
.test1 {
  color: red;
  .test2 {
    color: aqua;
  }
}
</style>

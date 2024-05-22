<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import Button from "@/components/Button/Button.vue";
</script>

<template>
  <HelloWorld msg="Vite + Vue" />
  <div class="test1">
    111
    <div class="test2">222</div>
    <Button type="primary" plain size="large" disabled>Test button</Button>
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

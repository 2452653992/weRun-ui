<script setup lang="ts">
import { ref, onMounted, h } from "vue";
import Input from "./components/Input/Input.vue";
onMounted(() => {
  setTimeout(() => {}, 3000);
});
const test = ref("222");
</script>

<template>
  <div class="main">
    <Input type="text" v-model="test" clearable style="width: 240px" />
  </div>
</template>

<style scoped lang="scss">
.main {
  flex-direction: column;
  width: max-content;
  margin: 0 auto;
  height: 100vh;
  box-sizing: border-box;
}
</style>

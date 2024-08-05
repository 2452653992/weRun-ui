<script setup lang="ts">
import { ref, onMounted } from "vue";
import Switch from "./components/Switch/Switch.vue";
onMounted(() => {
  setTimeout(() => {}, 3000);
});
const test = ref("right");
</script>

<template>
  <div class="main">
    <Switch
      v-model="test"
      active-value="right"
      inactive-value="wrong"
      active-text="ON"
      inactive-text="OFF"
      disabled
    ></Switch>
    <h1>{{ test }}</h1>
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

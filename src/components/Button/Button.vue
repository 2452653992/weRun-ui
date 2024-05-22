<script setup lang="ts">
import type { ButtonProps } from "./types";
withDefaults(defineProps<ButtonProps>(), {
  nativeType: "button",
});
defineOptions({
  name: "WrButton",
});
</script>

<template>
  <button
    class="wr-button"
    :class="{
      [`wr-button--${type}`]: type,
      [`wr-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
    }"
    :disabled="disabled"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <span><slot /></span>
  </button>
</template>

<style scoped lang="scss"></style>

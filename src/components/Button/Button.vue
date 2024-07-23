<script setup lang="ts">
import { ref } from "vue";
import type { ButtonProps } from "./types";
import Icon from "../Icon/Icon.vue";
withDefaults(defineProps<ButtonProps>(), {
  nativeType: "button",
  size: "normal",
});
defineOptions({
  name: "WrButton",
});
const _ref = ref<HTMLButtonElement>();
defineExpose({
  ref: _ref,
});
</script>

<template>
  <button
    ref="_ref"
    class="wr-button"
    :class="{
      [`wr-button--${type}`]: type,
      [`wr-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
  >
    <Icon :icon="['fas', 'spinner']" spin v-if="loading" />
    <Icon :icon="icon" v-if="icon" />
    <span><slot /></span>
  </button>
</template>

<style scoped lang="scss">
.wr-button {
  background-color: var(--wr-bg-color);
  border: var(--wr-border-color-darker) var(--wr-border-width)
    var(--wr-border-style);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--wr-border-radius-base);
  padding: 8px 15px;
  font-size: var(--wr-font-size-base);
  font-family: var(--wr-font-family);
  transition: background-color var(--wr-transition-duration-fast) ease-in-out,
    color var(--wr-transition-duration-fast) ease-in-out;
  &:hover {
    background-color: var(--wr-color-primary-light-8);
    color: var(--wr-color-primary);
    border: var(--wr-color-primary-dark-2) var(--wr-border-width)
      var(--wr-border-style);
  }
  /*round*/
  &.is-round {
    border-radius: var(--wr-border-radius-round);
  }
  /*circle*/
  &.is-circle {
    border-radius: 50%;
    padding: 8px;
  }
  &:disabled {
    cursor: not-allowed;
    color: var(--wr-disabled-text-color);
    background-color: var(--wr-disabled-bg-color);
    border-color: var(--wr-disabled-border-color);
  }
  [class*="wr-icon"] + span {
    margin-left: 6px;
  }
}
.wr-button--normal {
  height: 32px;
}
@each $val in primary, success, warning, info, danger {
  .wr-button--#{$val} {
    color: var(--wr-color-white);
    background-color: var(--wr-color-#{$val});
    border-color: var(--wr-color-#{$val});
    outline-color: var(--wr-color-#{$val}-light-5);
    &:active {
      color: var(--wr-color-#{$val}-dark-2);
      background-color: var(--wr-color-#{$val}-dark-2);
      border-color: var(--wr-color-#{$val}-dark-2);
    }
    &:hover {
      color: var(--wr-color-white);
      background-color: var(--wr-color-#{$val}-light-3);
      border-color: var(--wr-color-#{$val}-light-3);
    }
    &:disabled {
      color: var(--wr-color-white);
      background-color: var(--wr-color-#{$val}-light-5);
      border-color: var(--wr-color-#{$val}-light-5);
    }
  }
  .wr-button--#{$val}.is-plain {
    color: var(--wr-color-#{$val});
    background-color: var(--wr-color-#{$val}-light-9);
    border-color: var(--wr-color-#{$val}-light-5);
    &:hover {
      color: var(--wr-color-white);
      background-color: var(--wr-color-#{$val});
      border-color: var(--wr-color-#{$val});
    }
    &:active {
      color: var(--wr-color-white);
    }
    &:disabled {
      color: var(--wr-color-white);
      background-color: var(--wr-color-#{$val}-light-5);
      border-color: var(--wr-color-#{$val}-light-5);
    }
  }
}
.wr-button--large {
  --wr-button-size: 40px;
  height: var(--wr-button-size);
  padding: 12px 19px;
  font-size: var(--wr-font-size-base);
  border-radius: var(--wr-border-radius-base);
}
.wr-button--small {
  --wr-button-size: 24px;
  height: var(--wr-button-size);
  padding: 5px 11px;
  font-size: 12px;
  border-radius: calc(var(--wr-border-radius-base) - 1px);
}
</style>

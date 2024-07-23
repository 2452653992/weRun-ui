<script setup lang="ts">
import type { AlertProps } from "./type";
import Icon from "../Icon/Icon.vue";
// 定义组件名称和配置项
defineOptions({
  name: "WrAlert",
});
// 设置组件传的props的默认值
withDefaults(defineProps<AlertProps>(), {
  type: "info",
  effect: "light",
  closable: true,
  center: false,
  showIcon: false,
});
</script>

<template>
  <div
    class="wr-alert"
    :class="{
      [`wr-alert--${type}`]: type,
      [`wr-alert--${effect}`]: effect,
      'is-center': center,
      'is-showIcon': showIcon,
    }"
  >
    <Icon class="wr-alert__icon" :icon="['fas', 'check']" />
    <div class="wr-alert__content">
      <span class="wr-alert__content__title">{{ title }}</span>
      <p class="wr-alert__content__text">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wr-alert {
  --wr-alert-padding: 8px 16px;
  --wr-alert-border-radius-base: var(--wr-border-radius-base);
  --wr-alert-title-font-size: 14px;
  --wr-alert-title-with-description-font-size: 16px;
  --wr-alert-description-font-size: 14px;
  --wr-alert-close-font-size: 16px;
  --wr-alert-close-customed-font-size: 14px;
  --wr-alert-icon-size: 16px;
  --wr-alert-icon-large-size: 28px;
  width: 100%;
  padding: var(--wr-alert-padding);
  margin: 0;
  box-sizing: border-box;
  border-radius: var(--wr-alert-border-radius-base);
  position: rwrative;
  background-color: var(--wr-color-white);
  overflow: hidden;
  opacity: 1;
  display: flex;
  align-items: center;
  transition: opacity var(--wr-transition-duration-fast);
  &.is-center {
    justify-content: center;
  }
  .wr-alert__icon {
    font-size: var(--wr-alert-icon-size);
    width: var(--wr-alert-icon-size);
    margin-right: 8px;
  }
  .wr-alert__content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
@each $val in primary, success, warning, danger, info {
  .wr-alert--#{$val} {
    background-color: var(--wr-color-#{$val}-light-9);
  }
}
</style>

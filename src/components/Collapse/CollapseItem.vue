<template>
  <div
    class="wr-collapse-item"
    :class="{
      'is-disabled': disabled,
    }"
  >
    <div
      class="wr-collapse-item__header"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive,
      }"
      :id="`item-header-${name}`"
      @click="handleClick"
    >
      <slot name="title">{{ title }}</slot>
      <Icon :icon="['fas', 'angle-right']" class="header-angle" />
    </div>
    <Transition name="slide" v-on="transitionEvents">
      <div class="wr-collapse-item__wrapper" v-show="isActive">
        <div class="wr-collapse-item__content" :id="`item-content-${name}`">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { inject, computed } from "vue";
import type { CollapseItemProps } from "./types";
import { collapseContextKey } from "./types";
import Icon from "../Icon/Icon.vue";
// 传进来的props
const props = defineProps<CollapseItemProps>();
// 定义组件名称
defineOptions({
  name: "WrCollapseItem",
});
// 接受父级注入的变量和事件
const collapseContext = inject(collapseContextKey);
const isActive = computed(() =>
  collapseContext?.activeNames.value.includes(props.name)
);
// 判断是否disabled
const handleClick = () => {
  if (props.disabled) {
    return;
  }
  collapseContext?.handleItemClick(props.name);
};
// 统一绑定事件的事件对象
const transitionEvents: Record<string, (el: HTMLElement) => void> = {
  beforeEnter(el) {
    el.style.height = "0px";
    el.style.overflow = "hidden";
  },
  enter(el) {
    el.style.height = `${el.scrollHeight}px`;
  },
  afterEnter(el) {
    el.style.height = "";
    el.style.overflow = "";
  },
  beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = "hidden";
  },
  leave(el) {
    el.style.height = "0px";
  },
  afterLeave(el) {
    el.style.height = "";
    el.style.overflow = "";
  },
};
</script>
<style scoped lang="scss">
.wr-collapse {
  --wr-collapse-border-color: var(--wr-border-color-light);
  --wr-collapse-header-height: 48px;
  --wr-collapse-header-bg-color: var(--wr-fill-color-blank);
  --wr-collapse-header-text-color: var(--wr-text-color-primary);
  --wr-collapse-header-font-size: 13px;
  --wr-collapse-content-bg-color: var(--wr-fill-color-blank);
  --wr-collapse-content-font-size: 13px;
  --wr-collapse-content-text-color: var(--wr-text-color-primary);
  --wr-collapse-disabled-text-color: var(--wr-disabled-text-color);
  --wr-collapse-disabled-border-color: var(--wr-border-color-lighter);
  border-top: 1px solid var(--wr-collapse-border-color);
  border-bottom: 1px solid var(--wr-collapse-border-color);
}
.wr-collapse-item__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--wr-collapse-header-height);
  line-height: var(--wr-collapse-header-height);
  background-color: var(--wr-collapse-header-bg-color);
  color: var(--wr-collapse-header-text-color);
  cursor: pointer;
  font-size: var(--wr-collapse-header-font-size);
  font-weight: 500;
  user-select: none;
  transition: border-bottom-color var(--wr-transition-duration);
  outline: none;
  border-bottom: 1px solid var(--wr-collapse-border-color);
  &.is-disabled {
    color: var(--wr-collapse-disabled-text-color);
    cursor: not-allowed;
    background-image: none;
  }
  &.is-active {
    border-bottom-color: transparent;
    .header-angle {
      transform: rotate(90deg);
    }
  }
  .header-angle {
    transition: transform var(--wr-transition-duration);
  }
}
.wr-collapse-item__content {
  will-change: height;
  background-color: var(--wr-collapse-content-bg-color);
  overflow: hidden;
  box-sizing: border-box;
  font-size: var(--wr-collapse-content-font-size);
  color: var(--wr-collapse-content-text-color);
  border-bottom: 1px solid var(--wr-collapse-border-color);
  padding-bottom: 25px;
}
.slide-enter-active,
.slide-leave-active {
  transition: height var(--wr-transition-duration);
}
</style>

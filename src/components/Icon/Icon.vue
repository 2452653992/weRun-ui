<template>
  <i
    class="wr-icon"
    :class="{
      [`wr-icon--${type}`]: type,
    }"
    :style="customStyles"
    v-bind="$attrs"
  >
    <font-awesome-icon v-bind="filteredProps" />
  </i>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { omit } from "lodash-es";
import type { IconProps } from "./types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
defineOptions({
  name: "WrIcon",
  inheritAttrs: false, // 阻止继续透传 与attrs配合使用
});
const props = defineProps<IconProps>();
const filteredProps = computed(() => {
  return omit(props, ["type", "color"]);
});
const customStyles = computed(() => {
  return props.color ? { color: props.color } : {};
});
</script>

<style scoped lang="scss">
.wr-icon {
  --wr-icon-color: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: var(--wr-icon-color);
  font-size: inherit;
}
@each $val in primary, info, success, warning, danger {
  .wr-icon--#{$val} {
    --wr-icon-color: var(--wr-color-#{$val});
  }
}
</style>

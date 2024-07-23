<template>
  <div class="wr-collapse">
    <slot />
  </div>
</template>
<script setup lang="ts">
import { ref, provide, watch } from "vue";
import type { NameType, CollpaseProps, CollpaseEmits } from "./types";
import { collapseContextKey } from "./types";
// 定义该组件接受的props变量
const props = defineProps<CollpaseProps>();
// 定义该组件接受的emit事件
const emits = defineEmits<CollpaseEmits>();
// 定义该组件的名称
defineOptions({
  name: "WrCollapse",
});
// 目前被激活的CollpaseItem变量集合
const activeNames = ref<NameType[]>(props.modelValue);
// 监听传过来的props的变化，解决异步问题
watch(
  () => props.modelValue,
  () => {
    activeNames.value = props.modelValue;
  }
);
if (props.accordion && activeNames.value.length > 1) {
  console.warn("accordion mode should only have one active item");
}
// item被点击时在父组件进行统一的事件处理
const handleItemClick = (item: NameType) => {
  if (props.accordion) {
    activeNames.value = [activeNames.value[0] === item ? "" : item];
  } else {
    const index = activeNames.value.indexOf(item);
    if (index > -1) {
      // 存在，删除数组里对应的一项
      activeNames.value.splice(index, 1);
    } else {
      // 不存在，插入对应的name
      activeNames.value.push(item);
    }
  }
  emits("update:modelValue", activeNames.value);
  emits("change", activeNames.value);
};
// 将事件和变量透传给子组件
provide(collapseContextKey, {
  activeNames,
  handleItemClick,
});
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
</style>

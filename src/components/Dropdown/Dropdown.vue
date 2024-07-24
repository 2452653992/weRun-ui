<template>
  <div class="wr-dropdown">
    <Tooltip
      :trigger="trigger"
      :placement="placement"
      :open-delay="openDelay"
      :close-delay="closeDelay"
      ref="tooltipRef"
      @visible-change="visiableChange"
    >
      <slot />
      <template #content>
        <ul class="wr-dropdown__menu">
          <template v-for="item in menuOptions" :key="item.key">
            <li
              v-if="item.divided"
              role="separator"
              class="divided-placeholder"
            />
            <li
              class="wr-dropdown__item"
              :class="{
                'is-disabled': item.disabled,
                'is-divided': item.divided,
              }"
              :id="`dropdown-item-${item.key}`"
              @click="itemClick(item)"
            >
              <RenderVnode :v-node="item.label" />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import type {
  DropdownProps,
  DropdownEmits,
  DropdownInstance,
  MenuOption,
} from "./types";
import { ref } from "vue";
import type { Ref } from "vue";
import Tooltip from "../Tooltip/Tooltip.vue";
import type { TooltipInstance } from "../Tooltip/types";
import RenderVnode from "../Common/RenderVnode";
const props = withDefaults(defineProps<DropdownProps>(), {
  hideAfterClick: true,
});
defineOptions({
  name: "WrDropdown",
});
const emits = defineEmits<DropdownEmits>();
const tooltipRef = ref() as Ref<TooltipInstance>;
const visiableChange = (e: boolean) => {
  emits("visible-change", e);
};

const itemClick = (e: MenuOption) => {
  if (e.disabled) {
    return;
  }
  emits("select", e);
  if (props.hideAfterClick) {
    tooltipRef.value?.hide();
  }
};
// 利用闭包
defineExpose<DropdownInstance>({
  hide: () => tooltipRef.value?.hide(),
  show: () => tooltipRef.value?.show(),
});
</script>
<style scoped lang="scss">
.wr-dropdown .wr-dropdown__menu {
  --wr-dropdown-menuItem-hover-fill: var(--wr-color-primary-light-9);
  --wr-dropdown-menuItem-hover-color: var(--wr-color-primary);
  --wr-dropdown-menuItem-disabled-color: var(--wr-border-color-lighter);
  --wr-dropdown-menuItem-divided-color: var(--wr-border-color-lighter);
}
.wr-dropdown {
  display: inline-block;
  .wr-tooltip {
    --wr-popover-padding: 5px 0;
  }
}
.wr-dropdown__menu {
  list-style-type: none;
  margin: 0;
  padding: 0;
  .wr-dropdown__item {
    display: flex;
    align-items: center;
    white-space: nowrap;
    list-style: none;
    line-height: 22px;
    padding: 5px 16px;
    margin: 0;
    font-size: var(--wr-font-size-base);
    color: var(--wr-text-color-regular);
    cursor: pointer;
    outline: none;
    &:hover {
      background-color: var(--wr-dropdown-menuItem-hover-fill);
      color: var(--wr-dropdown-menuItem-hover-color);
    }
    &.is-disabled {
      color: var(--wr-dropdown-menuItem-disabled-color);
      cursor: not-allowed;
      background-image: none;
    }
  }
  .divided-placeholder {
    margin: 6px 0;
    border-top: 1px solid var(--wr-dropdown-menuItem-divided-color);
  }
}
</style>

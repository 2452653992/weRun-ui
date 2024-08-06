<template>
  <div
    class="wr-select"
    :class="{ 'is-disabled': disabled }"
    @click="toggleDropdown"
    @mouseenter="states.mouseHover = true"
    @mouseleave="states.mouseHover = false"
  >
    <Tooltip
      placement="bottom-start"
      manual
      ref="tooltipRef"
      same
      @click-outside="controlDropdown(false)"
    >
      <Input
        v-model="states.inputValue"
        :disabled="disabled"
        :placeholder="filterPlaceholder"
        :readonly="!filterable || !isDropdownShow"
        @input="debounceOnFilter"
        ref="inputRef"
        @keydown="handleKeydown"
      >
        <template #suffix>
          <Icon
            icon="circle-xmark"
            v-if="showClearIcon"
            class="wr-input__clear"
            @mousedown.prevent="NOOP"
            @click="onClear"
          />
          <Icon
            v-else
            icon="angle-down"
            class="header-angle"
            :class="{
              'is-active': isDropdownShow,
            }"
          />
        </template>
      </Input>
      <template #content>
        <div class="wr-select__loading" v-if="states.loading">
          <Icon icon="spinner" spin />
        </div>
        <div
          class="wr-select__nodata"
          v-else-if="filterable && filteredOptions.length === 0"
        >
          no matching data
        </div>
        <ul class="wr-select__menu" v-else>
          <template v-for="(item, index) in filteredOptions" :key="index">
            <li
              class="wr-select__menu-item"
              :class="{
                'is-disabled': item.disabled,
                'is-selected': states.selectedOption?.value === item.value,
                'is-highlighted': states.highlightIndex === index,
              }"
              :id="`select-item-${item.value}`"
              @click.stop="itemSelect(item)"
            >
              <RenderVnode
                :v-node="renderLabel ? renderLabel(item) : item.label"
              />
            </li>
          </template>
        </ul>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import type {
  SelectEmits,
  SelectOption,
  SelectProps,
  selectStates,
} from "./types";
import Tooltip from "../Tooltip/Tooltip.vue";
import type { TooltipInstance } from "../Tooltip/types";
import Input from "../Input/Input.vue";
import type { InputInstance } from "../Input/types";
import Icon from "../Icon/Icon.vue";
import { ref, reactive, computed, watch } from "vue";
import RenderVnode from "../Common/RenderVnode";
import type { Ref } from "vue";
import { isFunction, debounce } from "lodash-es";
const findOption = (value: string) => {
  const option = props.options.find((option) => option.value === value);
  return option ? option : null;
};
defineOptions({
  name: "WrSelect",
});
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [], // 当设置一个数组的默认值的时候要用这种方式
});
const timeout = computed(() => (props.remote ? 300 : 0));
const emits = defineEmits<SelectEmits>();
const initialOption = findOption(props.modelValue);
const tooltipRef = ref() as Ref<TooltipInstance>;
const inputRef = ref() as Ref<InputInstance>;
const states = reactive<selectStates>({
  inputValue: initialOption ? initialOption.label : "",
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightIndex: -1,
});
watch(
  () => props.modelValue,
  (newVal) => {
    states.selectedOption = findOption(newVal);
  }
);
const isDropdownShow = ref(false);

const filteredOptions = ref(props.options);
watch(
  () => props.options,
  (newVal) => {
    filteredOptions.value = newVal;
  }
);
const generateFilterOptions = async (searchVal: string) => {
  if (!props.filterable) return;
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(searchVal);
  } else if (
    props.remote &&
    props.remoteMethod &&
    isFunction(props.remoteMethod)
  ) {
    states.loading = true;
    try {
      filteredOptions.value = await props.remoteMethod(searchVal);
    } catch (error) {
      console.log(error);
      filteredOptions.value = [];
    } finally {
      states.loading = false;
    }
  } else {
    filteredOptions.value = props.options.filter((option) =>
      option.label.includes(searchVal)
    );
  }
  states.highlightIndex = -1;
};
const onFilter = () => {
  generateFilterOptions(states.inputValue);
};
const debounceOnFilter = debounce(() => {
  onFilter();
}, timeout.value);
const filterPlaceholder = computed(() => {
  return props.filterable && states.selectedOption && isDropdownShow.value
    ? states.selectedOption.label
    : props.placeholder;
});
const controlDropdown = (show: boolean) => {
  if (show) {
    if (props.filterable && states.selectedOption) {
      states.inputValue = "";
    }
    if (props.filterable) {
      generateFilterOptions(states.inputValue);
    }
    tooltipRef.value.show();
  } else {
    tooltipRef.value.hide();
    if (props.filterable) {
      states.inputValue = states.selectedOption
        ? states.selectedOption.label
        : "";
    }
    states.highlightIndex = -1;
  }
  isDropdownShow.value = show;
  emits("visible-change", show);
};
const showClearIcon = computed(() => {
  // hover
  // props.clear
  // selectoption
  // input
  return (
    props.clearable &&
    states.mouseHover &&
    states.selectedOption &&
    states.inputValue.trim() !== ""
  );
});
const onClear = () => {
  states.selectedOption = null;
  states.inputValue = "";
  emits("clear");
  emits("change", "");
  emits("update:modelValue", "");
};
const NOOP = () => {};
// 点击的反转显示状态
const toggleDropdown = () => {
  if (props.disabled) return;
  if (isDropdownShow.value) {
    controlDropdown(false);
  } else {
    controlDropdown(true);
  }
};
const itemSelect = (e: SelectOption) => {
  if (e.disabled) return;
  states.inputValue = e.label;
  states.selectedOption = e;
  emits("change", e.value);
  emits("update:modelValue", e.value);
  controlDropdown(false);
  inputRef.value.ref.focus();
};
const handleKeydown = (e: KeyboardEvent) => {
  switch (e.key) {
    case "Enter":
      if (!isDropdownShow.value) {
        controlDropdown(true);
      } else {
        if (
          states.highlightIndex > -1 &&
          filteredOptions.value[states.highlightIndex]
        ) {
          itemSelect(filteredOptions.value[states.highlightIndex]);
        } else {
          controlDropdown(false);
        }
      }
      break;
    case "Escape":
      if (isDropdownShow.value) {
        controlDropdown(false);
      }
      break;
    case "ArrowUp":
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        if (states.highlightIndex === -1 || states.highlightIndex === 0) {
          states.highlightIndex = filteredOptions.value.length - 1;
        } else {
          states.highlightIndex--;
        }
      }
      break;
    case "ArrowDown":
      e.preventDefault();
      if (filteredOptions.value.length > 0) {
        if (
          states.highlightIndex === -1 ||
          states.highlightIndex === filteredOptions.value.length - 1
        ) {
          states.highlightIndex = 0;
        } else {
          states.highlightIndex++;
        }
      }
      break;
    default:
      break;
  }
};
</script>

<style lang="scss">
.wr-select {
  --wr-select-item-hover-bg-color: var(--wr-fill-color-light);
  --wr-select-item-font-size: var(--wr-font-size-base);
  --wr-select-item-font-color: var(--wr-text-color-regular);
  --wr-select-item-selected-font-color: var(--wr-color-primary);
  --wr-select-item-disabled-font-color: var(--wr-text-color-placeholder);
  --wr-select-input-focus-border-color: var(--wr-color-primary);
}

.wr-select {
  display: inline-block;
  vertical-align: middle;
  line-height: 32px;
  .wr-tooltip .wr-tooltip__popper {
    padding: 0;
  }
  .wr-input.is-focus .wr-input__wrapper {
    box-shadow: 0 0 0 1px var(--wr-select-input-focus-border-color) inset !important;
  }
  .wr-input {
    .header-angle {
      transition: transform var(--wr-transition-duration);
      &.is-active {
        transform: rotate(180deg);
      }
    }
  }

  .wr-input__inner {
    cursor: pointer;
  }
  .wr-select__nodata,
  .wr-select__loading {
    padding: 10px 0;
    margin: 0;
    text-align: center;
    color: var(--wr-text-color-secondary);
    font-size: var(--wr-select-font-size);
  }
  .wr-select__menu {
    list-style: none;
    margin: 6px 0;
    padding: 0;
    box-sizing: border-box;
  }
  .wr-select__menu-item {
    margin: 0;
    font-size: var(--wr-select-item-font-size);
    padding: 0 32px 0 20px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--wr-select-item-font-color);
    height: 34px;
    line-height: 34px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: var(--wr-select-item-hover-bg-color);
    }
    &.is-selected {
      color: var(--wr-select-item-selected-font-color);
      font-weight: 700;
    }
    &.is-highlighted {
      background-color: var(--wr-select-item-hover-bg-color);
    }
    &.is-disabled {
      color: var(--wr-select-item-disabled-font-color);
      cursor: not-allowed;
      &:hover {
        background-color: transparent;
      }
    }
  }
}
</style>

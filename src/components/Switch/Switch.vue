<template>
  <div
    class="wr-switch"
    :class="{
      [`wr-switch--${size}`]: size,
      'is-disabled': disabled,
      'is-checked': checked,
    }"
    @click="switchValue"
  >
    <input
      type="checkbox"
      role="switch"
      :name="name"
      :disabled="disabled"
      class="wr-switch__input"
      ref="input"
      @keydown.enter="switchValue"
    />
    <div class="wr-switch__core">
      <div class="wr-switch__core-inner">
        <span
          v-if="activeText || inactiveText"
          class="wr-switch__core-inner-text"
        >
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="wr-switch__core-action"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SwitchEmits, SwitchProps } from "./types";
import { ref, computed, onMounted, watch } from "vue";
defineOptions({
  name: "WrSwitch",
  inheritAttrs: false,
});
const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});
const emits = defineEmits<SwitchEmits>();
const innerValue = ref(props.modelValue);
const input = ref<HTMLInputElement>();

const checked = computed(() => innerValue.value === props.activeValue);
const switchValue = () => {
  if (props.disabled) return;
  const newValue = checked.value ? props.inactiveValue : props.activeValue;
  innerValue.value = newValue;
  emits("update:modelValue", newValue);
  emits("change", newValue);
};
watch(checked, (newVal) => {
  input.value!.checked = newVal;
});
watch(
  () => props.modelValue,
  (newVal) => {
    innerValue.value = newVal;
  }
);
onMounted(() => {
  input.value!.checked = checked.value;
});
</script>
<style scoped lang="scss">
.wr-switch {
  --wr-switch-on-color: var(--wr-color-primary);
  --wr-switch-off-color: var(--wr-border-color);
  --wr-switch-on-border-color: var(--wr-color-primary);
  --wr-switch-off-border-color: var(--wr-border-color);
}

.wr-switch {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  height: 32px;
  .wr-switch__input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
    &:focus-visible {
      & ~ .wr-switch__core {
        outline: 2px solid var(--wr-switch-on-color);
        outline-offset: 1px;
      }
    }
  }
  &.is-disabled {
    opacity: 0.6;
    .wr-switch__core {
      cursor: not-allowed;
    }
  }
  &.is-checked {
    .wr-switch__core {
      border-color: var(--wr-switch-on-border-color);
      background-color: var(--wr-switch-on-color);
      .wr-switch__core-action {
        left: calc(100% - 17px);
      }
      .wr-switch__core-inner {
        padding: 0 18px 0 4px;
      }
    }
  }
}
.wr-switch--large {
  font-size: 14px;
  line-height: 24px;
  height: 40px;
  .wr-switch__core {
    min-width: 50px;
    height: 24px;
    border-radius: 12px;
    .wr-switch__core-action {
      width: 20px;
      height: 20px;
    }
  }
  &.is-checked {
    .wr-switch__core .wr-switch__core-action {
      left: calc(100% - 21px);
      color: var(--wr-switch-on-color);
    }
  }
}
.wr-switch--small {
  font-size: 12px;
  line-height: 16px;
  height: 24px;
  .wr-switch__core {
    min-width: 30px;
    height: 16px;
    border-radius: 8px;
    .wr-switch__core-action {
      width: 12px;
      height: 12px;
    }
  }
  &.is-checked {
    .wr-switch__core .wr-switch-core-action {
      left: calc(100% - 13px);
      color: var(--wr-switch-on-color);
    }
  }
}
.wr-switch__core {
  display: inline-flex;
  align-items: center;
  position: relative;
  height: 20px;
  min-width: 40px;
  border: 1px solid var(--wr-switch-off-border-color);
  outline: none;
  border-radius: 10px;
  box-sizing: border-box;
  background: var(--wr-switch-off-color);
  cursor: pointer;
  transition: border-color var(--wr-transition-duration),
    background-color var(--wr-transition-duration);
  .wr-switch__core-action {
    position: absolute;
    left: 1px;
    border-radius: var(--wr-border-radius-circle);
    width: 16px;
    height: 16px;
    background-color: var(--wr-color-white);
    transition: all var(--wr-transition-duration);
  }
  .wr-switch__core-inner {
    width: 100%;
    transition: all var(--wr-transition-duration);
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    padding: 0 4px 0 18px;
    .wr-switch__core-inner-text {
      font-size: 12px;
      color: var(--wr-color-white);
      user-select: none;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>

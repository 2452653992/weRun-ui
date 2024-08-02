<template>
  <div
    class="wr-input"
    :class="{
      [`wr-input--${type}`]: type,
      [`wr-input--${size}`]: size,
      'is-disabled': disabled,
      'is-prepend': $slots.prepend,
      'is-append': $slots.append,
      'is-prefix': $slots.prefix,
      'is-suffix': $slots.suffix,
      'is-focus': isFocus,
    }"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div class="wr-input__prepend" v-if="$slots.prepend">
        <slot name="prepend" />
      </div>
      <div class="wr-input__wrapper">
        <!-- prefix slot -->
        <span v-if="$slots.prefix" class="wr-input__prefix">
          <slot name="prefix" />
        </span>
        <input
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          class="wr-input__inner"
          v-bind="attrs"
          ref="inputRef"
          :disabled="disabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :placeholder="placeholder"
          :autofocus="autofocus"
          :form="form"
          v-model="innerValue"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
        />
        <!-- suffix slot -->
        <span
          v-if="$slots.suffix || showClear || showPasswordArea"
          class="wr-input__suffix"
          @click="keepFocus"
        >
          <slot name="suffix" />
          <Icon
            icon="circle-xmark"
            v-if="showClear"
            class="wr-input__clear"
            @click="clear"
            @mousedown.prevent="NOOP"
          />
          <Icon
            icon="eye"
            v-if="showPasswordArea && passwordVisible"
            class="wr-input__password"
            @click="togglePasswordVisible"
          />
          <Icon
            icon="eye-slash"
            v-if="showPasswordArea && !passwordVisible"
            class="wr-input__password"
            @click="togglePasswordVisible"
          />
        </span>
      </div>
      <!-- append slot -->
      <div class="wr-input__append" v-if="$slots.append">
        <slot name="append" />
      </div>
    </template>
    <!-- textarea -->
    <template v-else>
      <textarea
        class="wr-textarea__wrapper"
        v-bind="attrs"
        ref="inputRef"
        :disabled="disabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :form="form"
        v-model="innerValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
      >
      </textarea>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { InputProps, InputEmits } from "./types";
import { ref, watch, computed, useAttrs, nextTick } from "vue";
import type { Ref } from "vue";
import Icon from "../Icon/Icon.vue";

defineOptions({
  name: "WrInput",
  inheritAttrs: false,
});
const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  autocomplete: "off",
});
const emits = defineEmits<InputEmits>();
const attrs = useAttrs();
const innerValue = ref(props.modelValue);
const isFocus = ref(false);
const passwordVisible = ref(false);
const inputRef = ref() as Ref<HTMLInputElement>;
const showClear = computed(
  () =>
    props.clearable && !props.disabled && !!innerValue.value && isFocus.value
);
const showPasswordArea = computed(
  () => props.showPassword && !props.disabled && !!innerValue.value
);
const NOOP = () => {};
const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
};
const keepFocus = async () => {
  await nextTick();
  inputRef.value.focus();
};
const handleInput = () => {
  emits("update:modelValue", innerValue.value);
  emits("input", innerValue.value);
};
const handleChange = () => {
  emits("change", innerValue.value);
};
const handleFocus = (event: FocusEvent) => {
  isFocus.value = true;
  emits("focus", event);
};
const handleBlur = (event: FocusEvent) => {
  isFocus.value = false;
  emits("blur", event);
};
const clear = () => {
  innerValue.value = "";
  emits("update:modelValue", "");
  emits("clear");
  emits("input", "");
  emits("change", "");
};

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue;
  }
);
defineExpose({
  ref: inputRef,
});
</script>
<style lang="scss" scoped>
.wr-input {
  --wr-input-text-color: var(--wr-text-color-regular);
  --wr-input-border: var(--wr-border);
  --wr-input-hover-border: var(--wr-border-color-hover);
  --wr-input-focus-border: var(--wr-color-primary);
  --wr-input-transparent-border: 0 0 0 1px transparent inset;
  --wr-input-border-color: var(--wr-border-color);
  --wr-input-border-radius: var(--wr-border-radius-base);
  --wr-input-bg-color: var(--wr-fill-color-blank);
  --wr-input-icon-color: var(--wr-text-color-placeholder);
  --wr-input-placeholder-color: var(--wr-text-color-placeholder);
  --wr-input-hover-border-color: var(--wr-border-color-hover);
  --wr-input-clear-hover-color: var(--wr-text-color-secondary);
  --wr-input-focus-border-color: var(--wr-color-primary);
}

.wr-input {
  --wr-input-height: var(--wr-component-size);
  position: relative;
  font-size: var(--wr-font-size-base);
  display: inline-flex;
  width: 100%;
  line-height: var(--wr-input-height);
  box-sizing: border-box;
  vertical-align: middle;
  &.is-disabled {
    cursor: not-allowed;
    .wr-input__wrapper {
      background-color: var(--wr-disabled-bg-color);
      box-shadow: 0 0 0 1px var(--wr-disabled-border-color) inset;
    }
    .wr-input__inner {
      color: var(--wr-disabled-text-color);
      -webkit-text-fill-color: var(--wr-disabled-text-color);
      cursor: not-allowed;
    }
    .wr-textarea__inner {
      background-color: var(--wr-disabled-bg-color);
      box-shadow: 0 0 0 1px var(--wr-disabled-border-color) inset;
      color: var(--wr-disabled-text-color);
      -webkit-text-fill-color: var(--wr-disabled-text-color);
      cursor: not-allowed;
    }
  }
  &.is-prepend {
    > .wr-input__wrapper {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  &.is-append {
    > .wr-input__wrapper {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}

.wr-input--large {
  --wr-input-height: var(--wr-component-size-large);
  font-size: 14px;
  .wr-input__wrapper {
    padding: 1px 15px;
    .wr-input__inner {
      --wr-input-inner-height: calc(var(--wr-input-height, 40px) - 2px);
    }
  }
}
.wr-input--small {
  --wr-input-height: var(--wr-component-size-small);
  font-size: 12px;
  .wr-input__wrapper {
    padding: 1px 7px;
    .wr-input__inner {
      --wr-input-inner-height: calc(var(--wr-input-height, 24px) - 2px);
    }
  }
}
.wr-input__prefix,
.wr-input__suffix {
  display: inline-flex;
  white-space: nowrap;
  flex-shrink: 0;
  flex-wrap: nowrap;
  height: 100%;
  text-align: center;
  color: var(--wr-input-icon-color, var(--wr-text-color-placeholder));
  transition: all var(--wr-transition-duration);
}
.wr-input__prefix {
  > :first-child {
    margin-left: 0px !important;
  }
  > :last-child {
    margin-right: 8px !important;
  }
}
.wr-input__suffix {
  > :first-child {
    margin-left: 8px !important;
  }
  > :last-child {
    margin-right: 0px !important;
  }
}
.wr-input__prepend,
.wr-input__append {
  background-color: var(--wr-fill-color-light);
  color: var(--wr-color-info);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  border-radius: var(--wr-input-border-radius);
  padding: 0 20px;
  white-space: nowrap;
}
.wr-input__prepend {
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 1px 0 0 0 var(--wr-input-border-color) inset,
    0 1px 0 0 var(--wr-input-border-color) inset,
    0 -1px 0 0 var(--wr-input-border-color) inset;
}
.wr-input__append {
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: 0 1px 0 0 var(--wr-input-border-color) inset,
    0 -1px 0 0 var(--wr-input-border-color) inset,
    -1px 0 0 0 var(--wr-input-border-color) inset;
  & > .wr-input__wrapper {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}

.wr-input--textarea {
  position: relative;
  display: inline-block;
  width: 100%;
  vertical-align: bottom;
  font-size: var(--wr-font-size-base);
}
.wr-textarea__wrapper {
  position: relative;
  display: block;
  resize: vertical;
  padding: 5px 11px;
  line-height: 1.5;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  font-family: inherit;
  color: var(--wr-input-text-color, var(--wr-text-color-regular));
  background-color: var(--wr-input-bg-color, var(--wr-fill-color-blank));
  background-image: none;
  -webkit-appearance: none;
  appearance: none;
  box-shadow: 0 0 0 1px var(--wr-input-border-color, var(--wr-border-color))
    inset;
  border-radius: var(--wr-input-border-radius, var(--wr-border-radius-base));
  transition: var(--wr-transition-box-shadow);
  border: none;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 1px var(--wr-input-focus-border-color) inset;
  }
  &::placeholder {
    color: var(--wr-input-placeholder-color);
  }
}
.wr-input__wrapper {
  display: inline-flex;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  padding: 1px 11px;
  background-color: var(--wr-input-bg-color, var(--wr-fill-color-blank));
  background-image: none;
  border-radius: var(--wr-input-border-radius, var(--wr-border-radius-base));
  transition: var(--wr-transition-box-shadow);
  box-shadow: 0 0 0 1px var(--wr-input-border-color, var(--wr-border-color))
    inset;
  &:hover {
    box-shadow: 0 0 0 1px var(--wr-input-hover-border-color) inset;
  }
  &.is-focus {
    box-shadow: 0 0 0 1px var(--wr-input-focus-border-color) inset;
  }
  .wr-input__inner {
    --wr-input-inner-height: calc(var(--wr-input-height, 32px) - 2px);
    width: 100%;
    flex-grow: 1;
    -webkit-appearance: none;
    appearance: none;
    color: var(--wr-input-text-color, var(--wr-text-color-regular));
    font-size: inherit;
    height: var(--wr-input-inner-height);
    line-height: var(--wr-input-inner-height);
    padding: 0;
    outline: none;
    border: none;
    background: none;
    box-sizing: border-box;
    &::placeholder {
      color: var(--wr-input-placeholder-color);
    }
  }
  .wr-icon {
    height: inherit;
    line-height: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all var(--wr-transition-duration);
    margin-left: 8px;
  }
  .wr-input__clear,
  .wr-input__password {
    color: var(--wr-input-icon-color);
    font-size: 14px;
    cursor: pointer;
    &:hover {
      color: var(--wr-input-clear-hover-color);
    }
  }
}
</style>

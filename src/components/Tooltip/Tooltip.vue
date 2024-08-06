<script setup lang="ts">
import type { TooltipEmits, TooltipProps, TooltipInstance } from "./types";
import { computed, reactive, ref, watch } from "vue";
import {
  useFloating,
  offset,
  flip,
  shift,
  arrow,
  size,
} from "@floating-ui/vue";
import useClickOutside from "@/hooks/useClickOutside";
import { debounce } from "lodash-es"; // 防抖
const props = withDefaults(defineProps<TooltipProps>(), {
  placement: "bottom",
  trigger: "hover",
  transition: "fade",
  openDelay: 0,
  closeDelay: 0,
});
const staticSide = computed(() => {
  const side = props.placement.split("-")[0];
  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[side];
  return staticSide;
});
const emits = defineEmits<TooltipEmits>();
const isOpen = ref(false);
const popperNode = ref<HTMLElement>();
const triggerNode = ref<HTMLElement>();
const popperContainerNode = ref<HTMLElement>();
const floatingArrow = ref<HTMLElement>();
defineOptions({
  name: "WrTooltip",
});
const open = () => {
  isOpen.value = true;
  emits("visible-change", true);
};
const close = () => {
  isOpen.value = false;
  emits("visible-change", false);
};
const openDebounce = debounce(open, props.openDelay);
const closeDebounce = debounce(close, props.closeDelay);
const openFinal = () => {
  openDebounce.cancel();
  openDebounce();
};
const closeFinal = () => {
  closeDebounce.cancel();
  closeDebounce();
};
const togglePopper = () => {
  if (isOpen.value) {
    closeFinal();
  } else {
    openFinal();
  }
};
defineExpose<TooltipInstance>({
  show: openFinal,
  hide: closeFinal,
});
// 动态绑定事件的响应式变量
let events: Record<string, any> = reactive({});
let outerEvents: Record<string, any> = reactive({});
const attachEvents = () => {
  if (props.trigger === "hover") {
    events["mouseenter"] = openFinal;
    outerEvents["mouseleave"] = closeFinal;
  } else if (props.trigger === "click") {
    events["click"] = togglePopper;
  }
};
if (!props.manual) {
  attachEvents();
}
watch(
  () => props.manual,
  (isManual) => {
    if (isManual) {
      // 清除事件
      events = {};
      outerEvents = {};
    } else {
      attachEvents();
    }
  }
);
watch(
  () => props.trigger,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      // 清除事件
      events = {};
      outerEvents = {};
      attachEvents();
    }
  }
);
// 获得中间件的配置项
const getFloatingOption = () => {
  const middlewareOption = [
    offset(10),
    flip(),
    shift(),
    arrow({ element: floatingArrow, padding: 5 }),
  ];
  if (props.same) {
    middlewareOption.push(
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      })
    );
  }
  return middlewareOption;
};
const { floatingStyles, middlewareData } = useFloating(
  triggerNode,
  popperNode,
  {
    placement: props.placement,
    middleware: getFloatingOption(),
  }
);

useClickOutside(popperContainerNode, () => {
  if (props.trigger === "click" && isOpen.value && !props.manual) {
    closeFinal();
  }
  if (isOpen.value) {
    emits("click-outside", true);
  }
});
</script>

<template>
  <div class="wr-tooltip" v-on="outerEvents" ref="popperContainerNode">
    <div class="wr-tooltip__trigger" ref="triggerNode" v-on="events">
      <slot />
    </div>
    <Transition :name="transition">
      <div
        class="wr-tooltip__popper"
        ref="popperNode"
        v-if="isOpen"
        :style="floatingStyles"
        :data-popper-placement="placement"
      >
        <slot name="content">
          {{ content }}
        </slot>
        <div
          id="arrow"
          ref="floatingArrow"
          :style="{
            position: 'absolute',
            left:
          middlewareData.arrow?.x != null
            ? `${middlewareData.arrow.x}px`
            : '',
        top:
          middlewareData.arrow?.y != null
            ? `${middlewareData.arrow.y}px`
            : '',
          [staticSide as string]: `${-(floatingArrow?.offsetWidth as number/2+1)}px`
        }"
        ></div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.wr-tooltip {
  --wr-popover-bg-color: var(--wr-bg-color-overlay);
  --wr-popover-font-size: var(--wr-font-size-base);
  --wr-popover-border-color: var(--wr-border-color-lighter);
  --wr-popover-padding: 12px;
  --wr-popover-border-radius: 4px;
  display: inline-block;
}
.wr-tooltip {
  .wr-tooltip__popper {
    background: var(--wr-popover-bg-color);
    border-radius: var(--wr-popover-border-radius);
    border: 1px solid var(--wr-popover-border-color);
    padding: var(--wr-popover-padding);
    color: var(--wr-text-color-regular);
    line-height: 1.4;
    text-align: justify;
    font-size: var(--wr-popover-font-size);
    box-shadow: var(--wr-box-shadow-light);
    word-break: break-all;
    box-sizing: border-box;
    z-index: 1000;
    #arrow,
    #arrow::before {
      position: absolute;
      width: 8px;
      height: 8px;
      box-sizing: border-box;
      background: var(--wr-popover-bg-color);
    }
    #arrow {
      visibility: hidden;
    }
    #arrow::before {
      visibility: visible;
      content: "";
      transform: rotate(45deg);
    }
    &[data-popper-placement^="top"] > #arrow::before {
      border-right: 1px solid var(--wr-popover-border-color);
      border-bottom: 1px solid var(--wr-popover-border-color);
    }
    &[data-popper-placement^="bottom"] > #arrow::before {
      border-left: 1px solid var(--wr-popover-border-color);
      border-top: 1px solid var(--wr-popover-border-color);
    }
    &[data-popper-placement^="left"] > #arrow::before {
      border-right: 1px solid var(--wr-popover-border-color);
      border-top: 1px solid var(--wr-popover-border-color);
    }
    &[data-popper-placement^="right"] > #arrow::before {
      border-left: 1px solid var(--wr-popover-border-color);
      border-bottom: 1px solid var(--wr-popover-border-color);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity var(--wr-transition-duration);
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>

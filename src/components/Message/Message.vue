<template>
  <Transition
    :name="transitionName"
    @after-leave="destroyComponent"
    @enter="updateHeight"
  >
    <div
      class="wr-message"
      v-show="visible"
      :class="{
        [`wr-message--${type}`]: type,
        'is-close': showClose,
      }"
      role="alert"
      ref="messageRef"
      :style="cssStyle"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div class="wr-message__content">
        <slot>
          <RenderVnode :v-node="message" v-if="message" />
        </slot>
      </div>
      <div class="wr-message__close" v-if="showClose">
        <Icon @click.stop="visible = false" icon="xmark" />
      </div>
    </div>
  </Transition>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import Icon from "../Icon/Icon.vue";
import type { MessageProps } from "./type";
import RenderVnode from "../Common/RenderVnode";
import { getLastBottomOffset } from "./method";
import useEventListener from "@/hooks/useEventListener";
const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
  offset: 20,
  transitionName: "fade-up",
});

const visible = ref(false);
const messageRef = ref<HTMLDivElement>();
// 计算偏移高度
// 也就是这个div的高度
const height = ref(0);
// 从上一个实例的最下面的坐标数字，第一个是0、
const lastOffset = computed(() => getLastBottomOffset(props.id));
// 最后是这个元素应该使用额top
const topOffset = computed(() => props.offset + lastOffset.value);
// 当前元素要为下一个元素预留的offset，也就是他最低端的bottom值
const bottomOffset = computed(() => height.value + topOffset.value);
const cssStyle = computed(() => ({
  top: `${topOffset.value}px`,
  zIndex: props.zIndex,
}));
let timer: any;
function startTimer() {
  if (props.duration === 0) return;
  timer = setTimeout(() => {
    visible.value = false;
  }, props.duration);
}
function clearTimer() {
  clearTimeout(timer);
}
function destroyComponent() {
  props.onDestory();
}
function updateHeight() {
  height.value = messageRef.value!.getBoundingClientRect().height;
}
// 由于在动画未完成之前组件就被销毁了，所以要采用上面的这种方式
// watch(visible, (newVal) => {
//   if (!newVal) {
//     props.onDestory();
//   }
// });
onMounted(async () => {
  visible.value = true;
  startTimer();
  await nextTick();
  height.value = messageRef.value!.getBoundingClientRect().height;
});
function keydown(e: Event) {
  const event = e as KeyboardEvent;
  if (event.code === "Escape") {
    visible.value = false;
  }
}
useEventListener(document, "keydown", keydown);
defineExpose({
  bottomOffset,
  visible,
});
</script>
<style lang="scss" scoped>
.wr-message {
  --wr-message-bg-color: var(--wr-color-info-light-9);
  --wr-message-border-color: var(--wr-border-color-lighter);
  --wr-message-padding: 15px 19px;
  --wr-message-close-size: 16px;
  --wr-message-close-icon-color: var(--wr-text-color-placeholder);
  --wr-message-close-hover-color: var(--wr-text-color-secondary);
}
.wr-message {
  width: fit-content;
  max-width: calc(100% - 32px);
  box-sizing: border-box;
  border-radius: var(--wr-border-radius-base);
  border-width: var(--wr-border-width);
  border-style: var(--wr-border-style);
  border-color: var(--wr-message-border-color);
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  background-color: var(--wr-message-bg-color);
  padding: var(--wr-message-padding);
  display: flex;
  align-items: center;
  transition: top var(--wr-transition-duration),
    opacity var(--wr-transition-duration),
    transform var(--wr-transition-duration);
  .wr-message__content {
    color: var(--wr-message-text-color);
    overflow-wrap: anywhere;
  }
  &.is-close .wr-message__content {
    padding-right: 30px;
  }
  .wr-message__close {
    display: flex;
    align-items: center;
  }
  .wr-message__close svg {
    cursor: pointer;
  }
}
@each $val in info, success, warning, danger {
  .wr-message--#{$val} {
    --wr-message-bg-color: var(--wr-color-#{$val}-light-9);
    --wr-message-border-color: var(--wr-color-#{$val}-light-8);
    --wr-message-text-color: var(--wr-color-#{$val});
    .wr-message__close {
      --wr-icon-color: var(--wr-color-#{$val});
    }
  }
}
.wr-message.fade-up-enter-from,
.wr-message.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
</style>

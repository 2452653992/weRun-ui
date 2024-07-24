<template>
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
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import Icon from "../Icon/Icon.vue";
import type { MessageProps } from "./type";
import RenderVnode from "../Common/RenderVnode";
import { getLastInstance, getLastBottomOffset } from "./method";
const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
  offset: 20,
});

const visible = ref(false);
const messageRef = ref<HTMLDivElement>();
// 计算偏移高度
// 也就是这个div的高度
const height = ref(0);
// 从上一个实例的最下面的坐标数字，第一个是0、
const lastOffset = computed(() => getLastBottomOffset());
// 最后是这个元素应该使用额top
const topOffset = computed(() => props.offset + lastOffset.value);
// 当前元素要为下一个元素预留的offset，也就是他最低端的bottom值
const bottomOffset = computed(() => height.value + topOffset.value);
const cssStyle = computed(() => ({
  top: `${topOffset.value}px`,
}));
function startTimer() {
  if (props.duration === 0) return;
  setTimeout(() => {
    visible.value = false;
  }, props.duration);
}
watch(visible, (newVal) => {
  if (!newVal) {
    props.onDestory();
  }
});
onMounted(async () => {
  visible.value = true;
  startTimer();
  await nextTick();
  height.value = messageRef.value!.getBoundingClientRect().height;
});
</script>
<style lang="scss" scoped>
.wr-message {
  width: max-content;
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  border: 1px solid blue;
}
</style>

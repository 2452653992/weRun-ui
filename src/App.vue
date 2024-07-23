<script setup lang="ts">
import { ref, onMounted } from "vue";
import Button from "./components/Button/Button.vue";
import Tooltip from "./components/Tooltip/Tooltip.vue";
import type { TooltipInstance } from "./components/Tooltip/types";
const TooltipRef = ref<TooltipInstance | null>(null);
const openedValue = ref(["a"]);
const trigger = ref<any>("click");
const placement = ref<"right" | "left" | "top" | "bottom" | undefined>("right");
const open = () => {
  TooltipRef.value?.show();
};

const close = () => {
  TooltipRef.value?.hide();
};
onMounted(() => {
  setTimeout(() => {
    openedValue.value.push("b");
    placement.value = "bottom";
    // trigger.value = "hover";
  }, 3000);
});
</script>

<template>
  <div class="main">
    <!-- <Icon :icon="['fas', 'user-secret']" type="danger" color="#0e7a0d" />
    <Icon :icon="['fas', 'spinner']" spin />
    <br /><br />
    <Button type="danger" size="large" loading>测试ICON</Button>
    <Button type="info" size="normal" icon="arrow-up">icon</Button>
    <Collpase v-model="openedValue" :accordion="true">
      <Item name="a" title="title111" disabled>
        <h1>headline title</h1>
        <div>this is a content</div>
      </Item>
      <Item name="b" title="title111">
        <h1>headline title</h1>
        <div>this is a content</div>
      </Item>
      <Item name="c" title="title111">
        <h1>headline title</h1>
        <div>this is a content</div>
      </Item>
    </Collpase>
    {{ openedValue }}
    <br />
    <br />
    <Alert type="primary" title="title" description="description">
      <h1>111</h1>
    </Alert>
    <Alert type="danger">
      <h1>111</h1>
    </Alert>
    <Alert type="info">
      <h1>111</h1>
    </Alert>
    <Alert type="success">
      <h1>111</h1>
    </Alert>
    <Alert type="warning">
      <h1>111</h1>
    </Alert> -->
    <Button @click="open" type="danger" size="large">测试ICON</Button>
    <Button @click="close" type="info" size="large">测试ICON</Button>
    <br />
    下面是toolip
    <br />
    <Tooltip content="hellow" :trigger="trigger" placement="right">
      <Button>right</Button>
      <template #content>
        <h1>hhhh</h1>
      </template>
    </Tooltip>
    <Tooltip content="hellow" :trigger="trigger" placement="bottom">
      <Button>bottom</Button>
      <template #content>
        <h1>hhhh</h1>
      </template>
    </Tooltip>
    <Tooltip content="hellow" :trigger="trigger" placement="top">
      <Button>top</Button>
      <template #content>
        <h1>hhhh</h1>
      </template>
    </Tooltip>
    <Tooltip content="hellow" :trigger="trigger" placement="left">
      <Button>left</Button>
      <template #content>
        <h1>hhhh</h1>
      </template>
    </Tooltip>
  </div>
</template>

<style scoped lang="scss">
.main {
  flex-direction: column;
  width: max-content;
  margin: 0 auto;
  height: 100vh;
}
</style>

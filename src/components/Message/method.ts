import type { CreateMessageProps, MessageContext } from "./type";
import { render, h, shallowReactive } from "vue";
import MessageConstructor from "./Message.vue";
import useZIndex from "@/hooks/useZIndex";
let seed = 1;
const instances: MessageContext[] = shallowReactive([]);
export const createMesssage = (props: CreateMessageProps) => {
  const { nextZIndex } = useZIndex();
  const id = `message_${seed++}`;
  const destory = () => {
    //   删除数组中的实例
    const idx = instances.findIndex((instance) => instance.id === id);
    if (idx === -1) return;
    instances.splice(idx, 1);
    render(null, container);
  };
  const newProps = {
    ...props,
    id,
    onDestory: destory,
    zIndex: nextZIndex(),
  };
  // 手动调用删除，也就是手动的调整组件中的visible的值
  // visible 是通过expose传出来的
  const manualDestory = () => {
    const instance = instances.find((instance) => instance.id === id);
    if (instance) {
      instance.vm.exposed!.visible.value = false;
    }
  };
  const container = document.createElement("div");
  const vnode = h(MessageConstructor, newProps);
  render(vnode, container);
  document.body.appendChild(container.firstElementChild!);
  const vm = vnode.component!;
  const instance = {
    id,
    vnode,
    vm,
    props: newProps,
    destory: manualDestory,
  };
  instances.push(instance);
  return instance;
};
export const getLastInstance = () => {
  return instances.at(-1);
};

export const getLastBottomOffset = (id: string) => {
  const idx = instances.findIndex((instance) => instance.id === id);
  if (idx <= 0) {
    return 0;
  } else {
    const prev = instances[idx - 1];
    return prev.vm.exposed!.bottomOffset.value;
  }
};

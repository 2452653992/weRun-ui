import type { VNode, ComponentInternalInstance } from "vue";
export interface MessageProps {
  message?: string | VNode;
  duration?: number;
  showClose?: boolean;
  type?: "success" | "info" | "warning" | "danger";
  onDestory: () => void;
  offset?: number;
  id: string;
  zIndex: number;
  transitionName?: string;
}

export type CreateMessageProps = Omit<
  MessageProps,
  "onDestory" | "id" | "zIndex"
>;
export interface MessageContext {
  id: string;
  vnode: VNode;
  props: MessageProps;
  destory: () => void;
  vm: ComponentInternalInstance;
}

import type { VNode } from "vue";
export interface MessageProps {
  message?: string | VNode;
  duration?: number;
  showClose?: boolean;
  type?: "success" | "info" | "warning" | "error";
  onDestory: () => void;
  offset?: number;
}

export type CreateMessageProps = Omit<MessageProps, "onDestory">;
export interface MessageContext {
  id: string;
  vnode: VNode;
  props: MessageProps;
}

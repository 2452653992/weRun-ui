import type { Placement } from "@floating-ui/vue";
export interface TooltipProps {
  content?: string;
  trigger?: "hover" | "click";
  placement: Placement;
  manual?: boolean;
  transition?: string;
  openDelay?: number;
  closeDelay?: number;
  same?: boolean; // 是否宽度相同
}
// 事件
export interface TooltipEmits {
  (e: "visible-change", value: boolean): void;
  (e: "click-outside", value: boolean): void;
}
// 实例身上的方法
export interface TooltipInstance {
  show: () => void;
  hide: () => void;
}

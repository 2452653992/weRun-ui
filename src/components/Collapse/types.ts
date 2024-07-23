import type { InjectionKey, Ref } from "vue";

export type NameType = string | number;
export interface CollapseItemProps {
  name: NameType;
  title?: string;
  disabled?: boolean;
}
export interface CollpaseContext {
  activeNames: Ref<NameType[]>;
  handleItemClick: (name: NameType) => void;
}
export const collapseContextKey: InjectionKey<CollpaseContext> =
  Symbol("collapssContextKey");
export interface CollpaseProps {
  modelValue: NameType[];
  accordion?: boolean;
}

export interface CollpaseEmits {
  (e: "update:modelValue", values: NameType[]): void;
  (e: "change", values: NameType[]): void;
}

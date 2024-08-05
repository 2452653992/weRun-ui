export type AlertType = "primary" | "success" | "warning" | "danger" | "info";
export type AlertEffect = "light" | "dark";

export interface AlertProps {
  type?: AlertType;
  effect?: AlertEffect;
  title?: string;
  description?: string;
  closable?: boolean;
  center?: boolean;
  closeText?: string;
  showIcon?: boolean;
}

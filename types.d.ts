import "react";

declare module "react" {
  // Inline CSS custom properties, e.g. style={{ "--bg": "#7c5cff" }}.
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

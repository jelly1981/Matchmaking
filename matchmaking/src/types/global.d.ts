export {};

declare global {
  interface Window {
    __ibBg?: { dispose: () => void };
  }
}
import { writable } from "svelte/store";

interface ToastState {
  message: string;
  type: "info" | "success" | "error";
}
const initialToastValue: ToastState[] = [];

export const toastStore = writable<ToastState[]>(initialToastValue);

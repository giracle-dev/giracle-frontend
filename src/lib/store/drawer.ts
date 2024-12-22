/**
 * サイドバーの展開状態を管理するためだけのStore
 */
import { writable } from "svelte/store";

export const openDrawer = writable(false);

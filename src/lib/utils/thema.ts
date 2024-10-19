import { themaStore } from "$lib/store/thema";
import { get } from "svelte/store";

// 端末がダークモードかどうか
export const changeThema = () => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (isDark) {
    console.log(" Thema変わります！");
    document.documentElement.setAttribute(
      "data-theme",
      get(themaStore).darkTheme,
    );
  } else {
    document.documentElement.setAttribute(
      "data-theme",
      get(themaStore).lightTheme,
    );
  }
};

import { writable } from "svelte/store";
import type { Theme } from "daisyui";

interface IThema {
  lightTheme: Theme;
  darkTheme: Theme;
}

const initialThemaValue: IThema = {
  lightTheme: "light",
  darkTheme: "dark",
};

export const themaStore = writable<IThema>(initialThemaValue);

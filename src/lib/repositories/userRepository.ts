import { myUserStore } from "$lib/store/myuser";
import type { IResponseUSerVerifyToken } from "$lib/types/IUser";
import { get } from "svelte/store";

export default {
  signUp: async (
    username: string,
    password: string,
  ): Promise<IResponseUSerVerifyToken> => {
    const response = await fetch("api/user/sign-up", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  },
  signIn: async (
    username: string,
    password: string,
  ): Promise<IResponseUSerVerifyToken> => {
    const response = await fetch("api/user/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const res:IResponseUSerVerifyToken = await response.json()
    //自分のユーザーIdをストアにセット
    myUserStore.set({...get(myUserStore), ...res.data});
    return res;
  },
  verifyToken: async (): Promise<IResponseUSerVerifyToken> => {
    const response = await fetch("api/user/verify-token", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    return await response.json();
  },
  changePassword: async (
    username: string,
    password: string,
  ): Promise<IResponseUSerVerifyToken> => {
    const response = await fetch("api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  },
};

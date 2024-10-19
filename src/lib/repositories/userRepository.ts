import type {
  IResponseUserinfo,
  IResponseUserList,
  IResponseUSerVerifyToken,
  IUser,
} from "$lib/types/IUser";

export default {
  signUp: async (
    username: string,
    password: string,
  ): Promise<IResponseUSerVerifyToken> => {
    const response = await fetch("/api/user/sign-up", {
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
    const response = await fetch("/api/user/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  },
  verifyToken: async (): Promise<IResponseUSerVerifyToken> => {
    const response = await fetch("/api/user/verify-token", {
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
    const response = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  },
  getUserInfo: async (userId: string): Promise<IResponseUserinfo> => {
    const response = await fetch("/api/user/info/" + userId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return await response.json();
  },
  updateProfile: async (
    name?: string,
    selfIntroduction?: string,
  ): Promise<IResponseUserinfo> => {
    const response = await fetch("/api/user/profile-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, selfIntroduction }),
    });
    return await response.json();
  },
  changeIcon: async (icon: File): Promise<IResponseUserinfo> => {
    const formData = new FormData();
    formData.append("icon", icon);
    const response = await fetch("/api/user/change-icon", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    return await response.json();
  },
  userList: async (): Promise<IResponseUserList> => {
    const response = await fetch("/api/user/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return await response.json();
  },
};

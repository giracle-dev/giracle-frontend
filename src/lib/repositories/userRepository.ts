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
    inviteCode: string,
  ): Promise<IResponseUSerVerifyToken> => {
    const response = await fetch("/api/user/sign-up", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, inviteCode }),
    });
    if (!response.ok) throw new Error("userRepository :: signUp :: エラー");
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
    if (!response.ok) throw new Error("userRepository :: signIn :: エラー");
    return await response.json();
  },
  verifyToken: async (): Promise<IResponseUSerVerifyToken> => {
    const response = await fetch("/api/user/verify-token", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("userRepository :: verifyToken :: エラー");
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
    if (!response.ok)
      throw new Error("userRepository :: changePassword :: エラー");
    return await response.json();
  },
  getUserInfo: async (userId: string): Promise<IResponseUserinfo> => {
    const response = await fetch("/api/user/info/" + userId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok)
      throw new Error("userRepository :: getUserInfo :: エラー");
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
    if (!response.ok)
      throw new Error("userRepository :: updateProfile :: エラー");
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
    if (!response.ok) throw new Error("userRepository :: changeIcon :: エラー");
    return await response.json();
  },
  changeBanner: async (banner: File): Promise<IResponseUserinfo> => {
    const formData = new FormData();
    formData.append("banner", banner);
    const response = await fetch("/api/user/change-banner", {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok)
      throw new Error("userRepository :: changeBanner :: エラー");
    return await response.json();
  },

  userList: async (): Promise<IResponseUserList> => {
    const response = await fetch("/api/user/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("userRepository :: userList :: エラー");
    return await response.json();
  },
};

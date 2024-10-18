import type {
  IResponseGetUserinfo,
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
  getUserInfo: async (userId: string): Promise<IResponseGetUserinfo> => {
    const response = await fetch("/api/user/info/" + userId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    return await response.json();
  },
  updateProfile: async (name?: string, selfIntroduction?: string):Promise<IResponseGetUserinfo> => {
    const response = await fetch("/api/user/profile-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, selfIntroduction }),
    });
    return await response.json();
  },
};

import { PUBLIC_BACKEND_ADDRESS } from "$env/static/public";

export default {
  signUp: async (username: string, password: string) => {
    const response = await fetch(`${PUBLIC_BACKEND_ADDRESS}/user/sign-up`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  },
  signIn: async (username: string, password: string) => {
    const response = await fetch(`${PUBLIC_BACKEND_ADDRESS}/user/sign-in`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  },
  changePassword: async (username: string, password: string) => {
    const response = await fetch(
      `${PUBLIC_BACKEND_ADDRESS}/user/change-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      },
    );
    return await response.json();
  },
};

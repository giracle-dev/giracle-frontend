import type { IResponseCreateInvite, IResponseGetInvite } from "$lib/types/IServer";

export default {
  getInvite: async (): Promise<IResponseGetInvite> => {
    const response = await fetch("/api/server/get-invite", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("serverRepository :: getInvite :: エラー");
    return await response.json();
  },
  createInvite: async (inviteCode: string): Promise<IResponseCreateInvite | Error> => {
    const response = await fetch("/api/server/create-invite", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        inviteCode,
      }),
    });
    if (!response.ok) throw new Error("serverRepository :: createInvite :: エラー");
    return await response.json();
  }
};

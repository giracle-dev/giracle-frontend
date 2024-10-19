import type { IResponseCreateInvite, IResponseGetInvite, IResponseUpdateInvite } from "$lib/types/IServer";

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
  createInvite: async (inviteCode: string): Promise<IResponseCreateInvite> => {
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
  },
  deleteInvite: async (inviteId: number): Promise<IResponseUpdateInvite> => {
    const response = await fetch("/api/server/delete-invite", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        inviteId,
      }),
    });
    if (!response.ok) throw new Error("serverRepository :: deleteInvite :: エラー");
    return await response.json();
  }
};

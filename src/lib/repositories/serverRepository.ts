import type { IResponseCreateInvite, IResponseGetInvite, IResponseDeleteInvite, IResponseGetConfig } from "$lib/types/IServer";

export default {
  getConfig: async (): Promise<IResponseGetConfig> => {
    const response = await fetch("/api/server/config", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("serverRepository :: getConfig :: エラー");
    return await response.json();
  },
  changeConfig: async (
    RegisterAvailable: boolean,
    RegisterInviteOnly: boolean,
    MessageMaxLength: number,
  ): Promise<IResponseGetConfig> => {
    const response = await fetch("/api/server/change-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        RegisterAvailable,
        RegisterInviteOnly,
        MessageMaxLength,
      }),
    });
    if (!response.ok) throw new Error("serverRepository :: changeConfig :: エラー");
    return await response.json();
  },
  changeInfo: async (
    name: string,
    introduction: string,
  ): Promise<IResponseGetConfig> => {
    const response = await fetch("/api/server/change-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name, introduction
      }),
    });
    if (!response.ok) throw new Error("serverRepository :: changeInfo :: エラー");
    return await response.json();
  },
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
  deleteInvite: async (inviteId: number): Promise<IResponseDeleteInvite> => {
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

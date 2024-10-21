import type { IResponseGetRoleList } from "$lib/types/IRole";

export default {
  getRoleList: async (): Promise<IResponseGetRoleList> => {
    const response = await fetch("/api/role/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("roleRepository :: getRoleList :: エラー");
    return await response.json();
  }
}
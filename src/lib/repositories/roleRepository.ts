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
  },
  updateRole: async (dat: {
    roleId: string,
    roleData: {
      name: string;
      color: string;
      manageServer: boolean;
      manageChannel: boolean;
      manageRole: boolean;
      manageUser: boolean;
    }
  }) => {
    const response = await fetch("/api/role/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dat),
    });
    if (!response.ok) throw new Error("roleRepository :: updateRole :: エラー");
    return await response.json();
  }
}
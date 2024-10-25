import type { IResponseGetRoleInfo, IResponseGetRoleList, IResponseSearchRoles } from "$lib/types/IRole";

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
  getRoleInfo: async (roleId: string): Promise<IResponseGetRoleInfo> => {
    const response = await fetch("/api/role/get-info/" + roleId, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("roleRepository :: getRoleList :: エラー");
    return await response.json();
  },
  searchRoles: async (searchWord: string): Promise<IResponseSearchRoles> => {
    const response = await fetch(`/api/role/search?name=${searchWord}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("roleRepository :: searchRoles :: エラー");
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
  },
  createRole: async (dat: {
    roleName: string,
    rolePower: {
      manageServer: boolean;
      manageChannel: boolean;
      manageRole: boolean;
      manageUser: boolean;
    }
  }) => {
    const response = await fetch("/api/role/create", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(dat),
    });
    if (!response.ok) throw new Error("roleRepository :: updateRole :: エラー");
    return await response.json();
  },
  deleteRole: async(roleId: string) =>{
    const response = await fetch("/api/role/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        roleId
      }),
    });
    if (!response.ok) throw new Error("roleRepository :: deleteRole :: エラー");
    return await response.json();
  }
}
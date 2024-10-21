export default {
  getRoleList: async () => {
    const response = await fetch("/api/role/list", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("roleRepository :: getRoleList :: エラー");
    return await response.json();
  }
}
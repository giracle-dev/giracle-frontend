import { get, writable } from "svelte/store";
import { myUserStore } from "./user";
import { roleListStore } from "./role";

/**
 * 自分の権限用Store
 */
export const myRolePowerStore = writable({
  manageServer: false,
  manageChannel: false,
  manageRole: false,
  manageUser: false
});

/**
 * 自分の権限を更新する
 */
export const updateMyRolePower = () => {
  const myRoleIds = get(myUserStore).RoleLink.map((r) => r.roleId);
  const myRoleInfos = get(roleListStore).filter((r) => myRoleIds.includes(r.id));
  //初期化
  myRolePowerStore.set({
    manageServer: false,
    manageChannel: false,
    manageRole: false,
    manageUser: false
  });
  //権限を更新
  for (const role of myRoleInfos) {
    if (role.manageServer) myRolePowerStore.update((r) => ({ ...r, manageServer: true }));
    if (role.manageChannel) myRolePowerStore.update((r) => ({ ...r, manageChannel: true }));
    if (role.manageRole) myRolePowerStore.update((r) => ({ ...r, manageRole: true }));
    if (role.manageUser) myRolePowerStore.update((r) => ({ ...r, manageUser: true }));
  }
  //console.log("updateMyRolePower", get(myRolePowerStore));
}

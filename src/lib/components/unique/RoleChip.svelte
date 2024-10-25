<script lang="ts">
  import { getRoleInfo, roleStore } from "$lib/store/role";
  import type { IRole } from "$lib/types/IRole";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  export let roleId: string;

  let role: IRole = {
    color: "",
    createdAt: new Date(),
    createdUserId: "",
    id: "",
    manageChannel: false,
    manageRole: false,
    manageServer: false,
    manageUser: false,
    name: "ロール"
  };

  onMount(async () => {
    const tempRole = await getRoleInfo(roleId);
    console.log("RoleChip :: onMount : tempRole", tempRole);

    if (tempRole !== undefined) role = tempRole;
  });

  $: role = $roleStore[roleId] || role;
</script>

<div>
  <span>{role.name || 'Loading...'}</span>
</div>
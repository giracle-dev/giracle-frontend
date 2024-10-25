<script lang="ts">
  import { getRoleInfo, roleStore } from "$lib/store/role";
  import type { IRole } from "$lib/types/IRole";
  import { onMount } from "svelte";

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

    if (tempRole !== undefined) role = tempRole;
  });

  $: role = $roleStore[roleId] || role;
</script>

<div>
  <span>{role.name || 'Loading...'}</span>
</div>
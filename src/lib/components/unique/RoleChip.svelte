<script lang="ts">
  import { getRoleInfo, roleStore } from "$lib/store/role";
  import type { IRole } from "$lib/types/IRole";
  import { onMount } from "svelte";
  import { IconPointFilled } from "@tabler/icons-svelte";

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
  <div class="badge badge-neutral badge-lg">
    <IconPointFilled color={role.color} class="-ml-2" />
    <p>{role.name || 'Loading...'}</p>
  </div>
</div>
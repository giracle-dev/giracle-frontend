<script lang="ts">
  import RoleChip from "$lib/components/unique/RoleChip.svelte";
  import { IconPlus, IconPointFilled } from "@tabler/icons-svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { toastStore } from "$lib/store/toast";
  import type { IRole } from "$lib/types/IRole";
  const roleRepository = repositoryFactory.get("role");

  export let roleList: { roleId: string }[] = [];
  export let userId: string;

  let roleListFetched: IRole[] = [];

  //ロールを取得する
  const fetchRole = async () => {
    if (roleListFetched.length !== 0) return;

    await roleRepository
      .getRoleList()
      .then((res) => {
        roleListFetched = res.data;
      })
      .catch((err) => {
        console.error(err);
      });
  }
</script>

<div class="flex flex-wrap items-center gap-1">

  {#each roleList as roleData}
    <RoleChip roleId={roleData.roleId} />
  {/each}

  <details class="dropdown">
    <summary on:click={fetchRole} class="btn btn-neutral btn-circle btn-xs">
      <IconPlus size={16} />
    </summary>
    <ul class="menu dropdown-content bg-base-200 rounded-box z-[1] w-52 p-2 shadow">
      {#each roleListFetched as role}
        <li class="text-left">
          <button on:click={()=>console.log('clicked :: ' + role.id)}>
            <IconPointFilled color={role.color} size={24} />
            {role.name}
          </button>
        </li>
      {/each}
    </ul>
  </details>

</div>

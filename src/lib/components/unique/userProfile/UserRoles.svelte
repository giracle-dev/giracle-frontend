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
  let selectedRoleIndex: number = -1;

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

  /**
   * 対象のユーザーに対しロールを付与する
   * @param roleId
   */
  const roleLink = async (roleId: string) => {
    await roleRepository
      .linkRole(roleId, userId)
      .then((res) => {
        //トースト通知を出すように
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "ロールをリンクしました!",
              type: "success",
            },
          ];
        });
      })
      .catch((err) => {
        console.error("UserRoles :: roleLink : err->", err);
        //トースト通知を出すように
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "ロールを付与できませんでした...",
              type: "error",
            },
          ];
        });
      });
  }

  /**
   * 対象のユーザーに対しロールを付与する
   * @param roleId
   */
  const roleUnlink = async (roleId: string) => {
    await roleRepository
      .unlinkRole(roleId, userId)
      .then((res) => {
        //トースト通知を出すように
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "ロールを解除しました",
              type: "success",
            },
          ];
        });
      })
      .catch((err) => {
        console.error("UserRoles :: roleUnlink : err->", err);
        //トースト通知を出すように
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "ロールを解除できませんでした...",
              type: "error",
            },
          ];
        });
      });
  }
</script>

<div class="flex flex-wrap items-start gap-1">

  {#each roleList as roleData,index}
    <button
      on:click={()=>roleUnlink(roleData.roleId)}
      on:mouseenter={()=>selectedRoleIndex = index}
      on:mouseleave={()=>selectedRoleIndex = -1}
      class="line-through"
      aria-label="Role Chip"
      tabindex={index}
    >
      <RoleChip
        roleId={roleData.roleId}
      />
    </button>
  {/each}

  <details class="dropdown">
    <summary on:click={fetchRole} class="btn btn-neutral btn-circle btn-xs">
      <IconPlus size={16} />
    </summary>
    <ul class="menu dropdown-content bg-base-200 rounded-box z-[1] w-52 p-2 shadow max-h-[25vh] overflow-y-auto">
      {#if roleListFetched.length === 0}
        <li class="text-left">
          <progress class="progress w-full"></progress>
          ロール一覧取得中...
        </li>
      {/if}
      {#each roleListFetched as role}
        <li class="text-left w-full truncate">
          <button on:click={()=>roleLink(role.id)}>
            <IconPointFilled color={role.color} size={24} />
            {role.name}
          </button>
        </li>
      {/each}
    </ul>
  </details>

</div>

<script lang="ts">
  import type { IRole } from "$lib/types/IRole";
  import { IconExclamationCircleFilled } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  const roleRepository = repositoryFactory.get("role");

  let processing = $state(false);
  let resultCreateRole: "success" | "error" | "" = $state("");
  let roleCreating: {
    roleName: string;
    rolePower: {
      manageServer: boolean;
      manageChannel: boolean;
      manageRole: boolean;
      manageUser: boolean;
    };
  } = $state({
    roleName: "",
    rolePower: {
      manageServer: false,
      manageChannel: false,
      manageRole: false,
      manageUser: false,
    },
  });
  let modalCreateRole: null | HTMLDialogElement = null;

  const createRole = async () => {
    processing = true;
    await roleRepository
      .createRole(roleCreating)
      .then((res) => {
        console.log("CreateRole :: createRole : res->", res.data);
        resultCreateRole = "success";
        modalCreateRole?.close();
      })
      .catch((e) => {
        console.log("CreateRole :: createRole : e->", e);
        resultCreateRole = "error";
      });
    processing = false;
  };

  onMount(() => {
    modalCreateRole = document.getElementById(
      "createInvite",
    ) as HTMLDialogElement;
  });
</script>

<dialog id="createInvite" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">新規ロールを作成</h3>
    <p class="py-4">ロール名</p>
    <input
      bind:value={roleCreating.roleName}
      type="text"
      placeholder="abc123..."
      class="input input-bordered w-full"
    />

    <div class="divider"></div>

    <label class="label cursor-pointer">
      <span class="label-text">ユーザーの管理</span>
      <input
        type="checkbox"
        class="toggle"
        bind:checked={roleCreating.rolePower.manageUser}
      />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text">チャンネルの管理</span>
      <input
        type="checkbox"
        class="toggle"
        bind:checked={roleCreating.rolePower.manageChannel}
      />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text">ロールの管理</span>
      <input
        type="checkbox"
        class="toggle"
        bind:checked={roleCreating.rolePower.manageRole}
      />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text">サーバー管理</span>
      <input
        type="checkbox"
        class="toggle"
        bind:checked={roleCreating.rolePower.manageServer}
      />
    </label>

    <div class="modal-action flex flex-row items-center">
      {#if resultCreateRole === "error"}
        <div
          role="alert"
          class="flex flex-row items-center alert alert-error w-fit mr-auto"
        >
          <IconExclamationCircleFilled size={20} />
          <span>エラーが発生しました。</span>
        </div>
      {/if}

      <form method="dialog">
        <button class="btn" disabled={processing}>キャンセル</button>
      </form>
      <button onclick={createRole} disabled={processing} class="btn btn-primary"
        >作成</button
      >
    </div>
  </div>
</dialog>

<script lang="ts">
  import type { IRole } from "$lib/types/IRole";
  import { IconExclamationCircleFilled } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  const roleRepository = repositoryFactory.get("role");

  let { roleDeleting }: { roleDeleting: IRole } = $props();

  export const openDeleteRoleDialog = (role: IRole) => {
    roleDeleting = role;
    modalDeleteRole?.showModal();
  };

  let processing = $state(false);
  let resultDeleteRole: "success" | "error" | "" = $state("");
  let modalDeleteRole: null | HTMLDialogElement = null;
  const deleteRole = async () => {
    processing = true;
    await roleRepository
      .deleteRole(roleDeleting.id)
      .then((res) => {
        console.log("DeleteRole :: deleteRole : res->", res.data);
        resultDeleteRole = "success";
        modalDeleteRole?.close();
      })
      .catch((e) => {
        console.log("DeleteRole :: deleteRole : e->", e);
        resultDeleteRole = "error";
      });
    processing = false;
  };

  onMount(() => {
    modalDeleteRole = document.getElementById(
      "deleteRole",
    ) as HTMLDialogElement;
  });
</script>

<dialog id="deleteRole" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">ロールを削除する</h3>
    <p class="py-4">次のロールを削除します</p>

    <p class="font-bold text-4xl text-center">{roleDeleting.name || "..."}</p>

    <div class="modal-action flex flex-row gap-2 mt-4 items-center">
      {#if resultDeleteRole === "error"}
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
      <button
        ondblclick={deleteRole}
        disabled={processing}
        class="btn btn-error">ダブルクリックで削除</button
      >
    </div>
  </div>
</dialog>

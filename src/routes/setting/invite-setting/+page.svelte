<script lang="ts">
  import { onMount } from "svelte";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import type { IInvite } from "$lib/types/IServer";
  import { goto } from "$app/navigation";
  import {
    IconExclamationCircleFilled,
    IconMailPlus,
    IconSettings,
  } from "@tabler/icons-svelte";
  const serverRepository = repositoryFactory.get("server");

  let modalCreateInvite: null | HTMLDialogElement = null;
  let invites: IInvite[] = [];

  let newInviteCode = "";
  let processingCreateInvite = false;
  let resultCreateInvite: "success" | "error" | "" = "";

  //招待を作成
  const createInvite = async () => {
    processingCreateInvite = true;
    resultCreateInvite = "";
    await serverRepository
      .createInvite(newInviteCode)
      .then((response) => {
        //console.log("createInvite : response->", response);
        //モーダルを閉じる
        modalCreateInvite?.close();
      })
      .catch((error) => {
        console.log("createInvite : error->", error);
        //結果格納
        resultCreateInvite = "error";
      });
    processingCreateInvite = false;
  };

  //招待を削除する
  const deleteInvite = async (index: number) => {
    await serverRepository.deleteInvite(invites[index].id).then((res) => {
      //削除
      invites.splice(index, 1);
      console.log("res->", res);
    });
  };

  onMount(async () => {
    modalCreateInvite = document.getElementById(
      "createInvite",
    ) as HTMLDialogElement;
    invites = (await serverRepository.getInvite()).data;
  });
</script>

<div class="p-2 flex flex-col gap-3 mx-auto max-w-[950px]">
  <div class="card bg-base-200 shadow-xl">
    <div class="card-body flex flex-row">
      <button
        class="btn btn-ghost w-16"
        on:click={() => {
          goto("/setting");
        }}
      >
        <IconSettings size={20} />
      </button>
      <h2 class="card-title">招待一覧</h2>
    </div>
  </div>

  <div class="card bg-base-200 shadow-xl overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>招待コード</th>
          <th>作成者</th>
          <th>使用回数</th>
          <th>有効期限</th>
        </tr>
      </thead>
      <tbody>
        {#each invites as inv, index}
          <tr class="hover bg-base-300">
            <td class="text-xs">{inv.inviteCode}</td>
            <td class="text-xs">
              <p class="truncate w-12">
                {inv.createdUserId}
              </p>
            </td>
            <td class="text-xs">{inv.usedCount}</td>
            <td class="text-xs">{new Date(inv.expireDate).toLocaleString()}</td>
            <td class="text-xs">
              <button
                on:click={() => deleteInvite(index)}
                class="btn btn-sm hover:btn-primary"
              >
                削除
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<dialog id="createInvite" class="modal modal-bottom sm:modal-middle">
  <div class="modal-box">
    <h3 class="text-lg font-bold">招待を作成!</h3>
    <p class="py-4">新しい招待コード</p>
    <input
      bind:value={newInviteCode}
      type="text"
      placeholder="abc123..."
      class="input input-bordered w-full"
    />

    <div class="modal-action flex flex-row items-center">
      {#if resultCreateInvite === "error"}
        <div
          role="alert"
          class="flex flex-row items-center alert alert-error w-fit mr-auto"
        >
          <IconExclamationCircleFilled size={20} />
          <span>エラーが発生しました。</span>
        </div>
      {/if}

      <form method="dialog">
        <button class="btn">キャンセル</button>
      </form>
      <button
        on:click={createInvite}
        disabled={processingCreateInvite}
        class="btn btn-primary">作成</button
      >
    </div>
  </div>
</dialog>

<button
  on:click={() => modalCreateInvite?.showModal()}
  class="btn btn-primary btn-square w-20 h-20 fixed bottom-10 right-10"
>
  <IconMailPlus size={28} />
</button>

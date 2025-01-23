<script>
  import {goto} from "$app/navigation";
  import {IconSettings} from "@tabler/icons-svelte";
  import {repositoryFactory} from "$lib/repositories/RepositoryFactory";
  import {onMount} from "svelte";
  import displaySizeForHuman from "$lib/utils/DisplaySizeForHuman";
  const serverRepository = repositoryFactory.get("server");

  let FileStorageUsage = $state(0);

  //ストレージ使用量を取得
  const getStorageUsage = async () => {
    await serverRepository
      .getStorageUsage()
      .then((res) => {
        console.log("/server/storage-manage :: getStorageUsage : res->", res);
        FileStorageUsage = res.data;
      })
      .catch((err) => {
        console.log("/server/storage-manage :: getStorageUsage : エラー->", err);
      });
  };

  onMount(() => {
    getStorageUsage();
  });
</script>

<div class="p-2 mx-auto max-w-[850px] flex flex-col gap-3">
  <div class="card bg-base-200 p-3 flex flex-row items-center">
    <button
      class="btn btn-ghost w-16"
      onclick={() => {
        goto("/setting");
      }}
    >
      <IconSettings size={20} />
    </button>
    <p class="card-title">ストレージ管理</p>
  </div>

  <div class="card bg-base-200">
    <div class="card-body">
      <span class="flex flex-row items-center">
        <span class="text-xl">総ストレージ量 :</span>
        <code class="text-xl ml-auto">{displaySizeForHuman(FileStorageUsage)}</code>
      </span>

      <div class="divider"></div>

      <div class="text-center">Coming soon...</div>
    </div>
  </div>
</div>
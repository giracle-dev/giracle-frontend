<script lang="ts">
  import { IconFile, IconDownload } from "@tabler/icons-svelte";
  import type { IMessageFileAttached } from "$lib/types/IMessage";

  export let fileData: IMessageFileAttached;

  //ファイルをダウンロードする
  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = `/api/message/file/${fileData.id}`;
    link.download = fileData.actualFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
</script>

<div>
  {#if fileData.type.startsWith("image")}
    <img
      src={`/api/message/file/${fileData.id}`}
      alt={fileData.actualFileName}
      class="max-h-[150px] md:max-h-[350px]"
    />
  {:else}
    <div class="flex bg-base-200 items-center rounded px-4 py-3">
      <IconFile class="w-6 h-6 mr-2" />
      <p>{fileData.actualFileName}</p>

      <button on:click={downloadFile} class="btn btn-square btn-sm ml-auto">
        <IconDownload />
      </button>
    </div>
  {/if}
</div>

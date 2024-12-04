<script lang="ts">
  import { IconFile, IconDownload } from "@tabler/icons-svelte";
  import type { IMessageFileAttached } from "$lib/types/IMessage";

  export let fileData: IMessageFileAttached;
  export let forcedImageSize: string | undefined = "auto";

  const filePath = "/api/message/file/";

  let imagePreviewModal:HTMLDialogElement;

  //ファイルをダウンロードする
  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = `${filePath}${fileData.id}`;
    link.download = fileData.actualFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const previewImage = (fileData :IMessageFileAttached)=>{
    if(!fileData.type.startsWith("image")) return;
    console.log("clickedImage!");
    imagePreviewModal.showModal();

  }

</script>

<div class="h-fit">
  <button  on:click={()=>previewImage(fileData)}>
  {#if fileData.type.startsWith("image")}
    <img
      src={`${filePath}${fileData.id}`}
      alt={fileData.actualFileName}
      class={`h-${forcedImageSize ? "[" + forcedImageSize + "]" : "auto"} max-h-[150px] md:max-h-[350px] rounded-md`}
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
  </button>
</div>

<dialog id="imagePreviewModal" class="modal" bind:this={imagePreviewModal} >

  <img
          src={`${filePath}${fileData.id}`}
          alt={fileData.actualFileName}
          class="x-auto m-auto px-10 py-20 w-auto h-auto max-h-screen max-w-screen pointer-events-none"
  />
  <button class="w-full h-full absolute top-0 left-0 modal-backdrop" on:click={()=>imagePreviewModal.close()}/>
</dialog>


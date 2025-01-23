<script lang="ts">
  import { page } from "$app/state";
  import displaySizeForHuman from "$lib/utils/DisplaySizeForHuman";
  import { IconSquareRoundedXFilled, IconX } from "@tabler/icons-svelte";
  import { onMount } from "svelte";

  interface Props {
    fileData: File;
    removeFilePROXY: (file: File) => void;
    appendFileId: (fileId: string) => void;
  }

  let { fileData, removeFilePROXY, appendFileId }: Props = $props();

  let uploadResult = $state("");
  let progress = $state(0);

  /**
   * ファイルをアップロードする
   */
  const uploadIt = () => {
    if (fileData.arrayBuffer === null) return;

    //アップロードするデータフォームオブジェクト生成
    const formData = new FormData();
    //送信者情報とディレクトリを付与
    formData.append("channelId", page.params.id);
    //ファイルそのものを内包
    formData.append("file", fileData);

    //アップロード用のXHRインスタンス
    const xhr = new XMLHttpRequest();
    //アップロード状況追跡用
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        //アップロード状況を更新する
        progress = Math.round((event.loaded / event.total) * 100);
        /*
        if (progress % 10 === 0)
          console.log("FileChip :: uploadIt : progress->", progress);
        */
      }
    });

    //アップロードの結果用
    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        console.log("FileItem :: 成功!->", xhr.responseText);
        const result: { result: string; data: { fileId: string } } = JSON.parse(
          xhr.responseText,
        );
        //結果を格納
        uploadResult = "SUCCESS";
        //結果がちゃんと取れているなら親コンポにファイルIdを渡す
        if (result.data !== undefined) {
          appendFileId(result.data.fileId);
          uploadResult = "SUCCESS";
        } else {
          //エラーとして設定
          uploadResult = "FAILED";
        }
      } else {
        uploadResult = "FAILED";
        console.error("FileChip :: 失敗...->", xhr.statusText);
      }
    });

    //アップロード先のURLを指定
    xhr.open("POST", "/api/message/file/upload");
    //アップロードする
    xhr.send(formData);
  };

  onMount(() => uploadIt());
</script>

<div
  class="card bg-base-200 shrink-0 h-fit max-w-[200px] sm:max-w-[300px] overflow-x-auto flex-col px-3 py-2"
>
  {#if fileData.type.startsWith("image/")}
    <figure>
      <img
        src={URL.createObjectURL(fileData)}
        alt={fileData.name}
        class="max-h-[100px] sm:max-h-[150px] max-w-[150px] rounded-xl"
      />
    </figure>
  {/if}

  <span class="flex flex-row items-center gap-1">
    {#if uploadResult === "SUCCESS"}
      <span class="text-green-500">✔</span>
    {:else if uploadResult === "FAILED"}
      <span class="text-red-500">✖</span>
    {:else}
      <div
        class="radial-progress"
        style={`--value:${progress}; --size:1rem;`}
        role="progressbar"
      ></div>
    {/if}

    <p class="truncate text-xs">
      {fileData.name.length > 25
        ? fileData.name.slice(0, 25) + "..."
        : fileData.name}
    </p>
    <span class="badge text-xs shrink-0"
      >{displaySizeForHuman(fileData.size)}</span
    >
    <button
      onclick={() => removeFilePROXY(fileData)}
      class="btn btn-xs btn-square"
    >
      <IconSquareRoundedXFilled />
    </button>
  </span>
</div>

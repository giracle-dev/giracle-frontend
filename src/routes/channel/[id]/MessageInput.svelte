<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { userListStore } from "$lib/store/user";
  import { IconSend2, IconPaperclip } from "@tabler/icons-svelte";
  import type { IUser } from "$lib/types/IUser";
  import FileChip from "$lib/components/channel/Messageinput/FileChip.svelte";
  import { toastStore } from "$lib/store/toast";

  let userList: IUser[] = [];
  userListStore.subscribe((users) => {
    // ユーザーリストからSYSTEMを除外
    if (users.length > 0) {
      users = users.filter((user) => user.id !== "SYSTEM");
    }
    userList = users;
  });
  let message = ""; //メッセージ入力用
  let fileIds: string[] = []; //メッセージに使うファイルのID
  let textarea: HTMLTextAreaElement;
  let selectedFiles: File[] = []; // 選択されたファイルを保持
  let mentionListVisible = false;
  let mentionQuery = "";
  let filteredUserList: IUser[] = [];
  let selectedUserIndex = 0; // 選択されたユーザーのインデックスを保持

  const dispatch = createEventDispatcher();

  // ペーストイベントを処理する関数
  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        const file = item.getAsFile();
        if (file) {
          selectedFiles = [...selectedFiles, file];
        }
      }
    }
  };

  // ペーストイベントリスナーを追加
  onMount(() => {
    textarea.addEventListener("paste", handlePaste);
    return () => {
      textarea.removeEventListener("paste", handlePaste);
    };
  });

  const sendMessage = async () => {
    console.log("sendMessage");
    if (message.trim() === "" && selectedFiles.length === 0) {
      return;
    }

    //すべてのファイルがアップロードされたかどうかを確認
    if (fileIds.length !== selectedFiles.length) {
      //トースト通知表示
      toastStore.update((toast) => {
        return [
          ...toast,
          {
            message: "ファイルのアップロードが完了していません",
            type: "error",
          },
        ];
      });
      return;
    }

    const messageToSend: {
      message: string;
      fileIds: string[];
    } = {
      message: message,
      fileIds: fileIds,
    };
    dispatch("sendMessage", messageToSend);
    message = ""; // メッセージをリセット
    selectedFiles = []; // ファイルをリセット
    fileIds = []; // ファイルIDをリセット
    clickSendAdjustTextareaHeight(); // メッセージ送信後に高さをリセット
  };

  const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      selectedFiles = [...selectedFiles, ...Array.from(input.files)];
    }
  };

  const adjustTextareaHeight = () => {
    //console.log("adjustTextareaHeight", textarea);
    if (textarea) {
      textarea.style.height = "42px"; // 一旦高さをリセット
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"; // 最大200pxまで広げる
    }
  };

  const clickSendAdjustTextareaHeight = () => {
    if (textarea) {
      textarea.style.height = "42px"; // 高さをリセット
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      if (event.key === "Enter" && !event.shiftKey) {
        setTimeout(adjustTextareaHeight, 0); // 改行後に高さを調整
        return;
      }
    } else {
      if (
        navigator.platform.toUpperCase().indexOf("MAC") >= 0 &&
        event.keyCode === 229
      ) {
        return;
      }
      if (event.key === "Enter" && event.ctrlKey) {
        return;
      }
      if (event.key === "Enter" && event.shiftKey) {
        setTimeout(adjustTextareaHeight, 0); // 改行後に高さを調整
        return;
      }
      if (event.key === "Enter") {
        if (mentionListVisible && selectedUserIndex >= 0) {
          selectUser(filteredUserList[selectedUserIndex]);
          event.preventDefault();
        } else {
          sendMessage();
          event.preventDefault(); // Enterキーのデフォルト動作を防ぐ
          clickSendAdjustTextareaHeight();
        }
      } else if (event.key === "ArrowDown") {
        if (mentionListVisible) {
          selectedUserIndex = (selectedUserIndex + 1) % filteredUserList.length;
          event.preventDefault();
        }
      } else if (event.key === "ArrowUp") {
        if (mentionListVisible) {
          selectedUserIndex =
            (selectedUserIndex - 1 + filteredUserList.length) %
            filteredUserList.length;
          event.preventDefault();
        }
      }
    }
  };

  const triggerFileInput = () => {
    document.getElementById("fileInput")?.click();
  };

  const removeFile = (fileToRemove: File) => {
    selectedFiles = selectedFiles.filter((file) => file !== fileToRemove);
  };

  const handleInput = (event: Event) => {
    const input = event.target as HTMLTextAreaElement;
    const cursorPosition = input.selectionStart;
    const textBeforeCursor = input.value.slice(0, cursorPosition);
    const mentionIndex = textBeforeCursor.lastIndexOf("@");

    if (mentionIndex !== -1) {
      console.log("mentionIndex", mentionIndex);
      mentionQuery = textBeforeCursor.slice(mentionIndex + 1);
      filteredUserList = Object.values(userList).filter((user) =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase()),
      );
      selectedUserIndex = 0;
      console.log("filteredUserList", filteredUserList);
      mentionListVisible = filteredUserList.length > 0;
    } else {
      mentionListVisible = false;
    }

    adjustTextareaHeight();
  };

  const selectUser = (user: IUser) => {
    const cursorPosition = textarea.selectionStart;
    const textBeforeCursor = message.slice(0, cursorPosition);
    const mentionIndex = textBeforeCursor.lastIndexOf("@");

    if (mentionIndex !== -1) {
      message =
        message.slice(0, mentionIndex) +
        `@<${user.id}>` +
        message.slice(cursorPosition);
      mentionListVisible = false;
    }
  };
</script>

<div class="flex flex-col w-full">
  <div class="file-preview-list overflow-x-auto w-full flex items-end gap-2">
    {#if mentionListVisible}
      <div
        class="relative flex flex-col gap-2 mb-2 border w-full max-h-32 overflow-y-auto"
      >
        {#each filteredUserList as user, index}
          <button
            class="p-2 text-left w-full flex items-center gap-2 {index ===
            selectedUserIndex
              ? 'bg-gray-200 text-neutral'
              : ''}"
            on:click={() => selectUser(user)}
            on:keydown={(event) => {
              if (event.key === "Enter") {
                selectUser(user);
              }
            }}
            tabindex="0"
          >
            <img
              src={`/api/user/icon/${user.id}`}
              alt={user.name}
              class="w-6 h-6 rounded-full object-cover"
            />
            {user.name}
          </button>
        {/each}
      </div>
    {:else if selectedFiles.length > 0}
      {#each selectedFiles as file}
        <FileChip
          fileData={file}
          removeFilePROXY={(f) => removeFile(f)}
          appendFileId={(Fid) => fileIds.push(Fid)}
        />
      {/each}
    {/if}
  </div>

  <div class="flex w-full mt-2">
    <button
      on:click={triggerFileInput}
      class="mr-2 p-2 text-white rounded bg-neutral"
    >
      <IconPaperclip size={20} />
      <input
        type="file"
        id="fileInput"
        on:change={handleFileChange}
        class="hidden"
        multiple
      />
    </button>
    <div class="flex grow gap-2 w-full">
      <textarea
        bind:value={message}
        placeholder="メッセージを入力"
        class="p-2 border rounded-lg resize-none h-10 w-full"
        on:keydown={handleKeyDown}
        bind:this={textarea}
        on:input={handleInput}
      />
      <button
        on:click={sendMessage}
        class="p-2 text-white rounded-lg bg-neutral {message.trim() === '' &&
        selectedFiles.length === 0
          ? 'opacity-50'
          : ''}"
        disabled={message.trim() === "" && selectedFiles.length === 0}
      >
        <IconSend2 size={20} />
      </button>
    </div>
  </div>
</div>

<style>
  .file-preview-list {
    margin-top: 10px;
  }
  .file-preview-item {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
  }
  .file-preview-image {
    max-width: 50px;
    max-height: 50px;
    margin-right: 10px;
  }
  .remove-icon {
    position: absolute;
    top: 0;
    right: 0;
    margin: 5px;
    cursor: pointer;
    background: white;
    border-radius: 50%;
    padding: 2px;
  }
</style>

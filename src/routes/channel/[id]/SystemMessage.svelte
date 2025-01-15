<script lang="ts">
  import { userListStore } from "$lib/store/user";
  import type { IMessage } from "$lib/types/IMessage";

  //props
  interface Props {
    message?: IMessage;
  }

  let {
    message = {
      channelId: "",
      content: "",
      createdAt: new Date(0),
      id: "",
      isSystemMessage: false,
      userId: "",
      MessageUrlPreview: [],
      MessageFileAttached: [],
    },
  }: Props = $props();

  type TSystemMessageTerm = "WELCOME" | "CHANNEL_JOIN" | "CHANNEL_LEFT";
  const SystemMessageMap: Record<TSystemMessageTerm, string> = {
    WELCOME: "がGiracleに参加しました。ようこそ！🎉",
    CHANNEL_JOIN: "が参加しました",
    CHANNEL_LEFT: "がチャンネルから脱退しました。",
  };

  let messageJson: {
    messageTerm: TSystemMessageTerm | "";
    targetUserId: string;
  } = $state({
    messageTerm: "",
    targetUserId: "",
  });

  $effect(() => {
    if (message.content) {
      messageJson = JSON.parse(message.content);
    }
  });
</script>

<div class="p-1">
  <div
    class="px-4 py-2 card bg-base-200 text-content-400 text-center flex flex-row items-center gap-2"
  >
    <div class="w-6">
      <img src="/api/user/icon/{messageJson}" alt="userIcon" />
    </div>
    <div class="truncate">
      {$userListStore.find((user) => user.id === messageJson.targetUserId)
        ?.name}
    </div>
    {messageJson.messageTerm !== ""
      ? SystemMessageMap[messageJson.messageTerm]
      : "..."}
  </div>
</div>

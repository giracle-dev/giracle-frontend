<script lang="ts">
  import { userListStore } from "$lib/store/user";
  import type { IMessage } from "$lib/types/IMessage";
  export let message: IMessage = {
    channelId: "",
    content: "",
    createdAt: new Date(0),
    id: "",
    isSystemMessage: false,
    userId: "",
    MessageUrlPreview: [],
    MessageFileAttached: [],
  };

  type TSystemMessageTerm = "WELCOME" | "CHANNEL_JOIN" | "CHANNEL_LEFT";
  const SystemMessageMap: Record<TSystemMessageTerm, string> = {
    WELCOME: "がGiracleに参加しました。ようこそ！🎉",
    CHANNEL_JOIN: "が参加しました",
    CHANNEL_LEFT: "がチャンネルから脱退しました。",
  };

  //メッセージの内容をJSON形式にパース
  const messageJson: {
    messageTerm: TSystemMessageTerm;
    targetUserId: string;
  } = JSON.parse(message.content);
</script>

<div class="p-2 card bg-base-200">
  <div
    class="px-4 text-content-400 text-center flex flex-row items-center gap-2"
  >
    <div class="w-6">
      <img src="/api/user/icon/{messageJson}" alt="userIcon" />
    </div>
    <div class="truncate">
      {$userListStore.find((user) => user.id === messageJson.targetUserId)
        ?.name}
    </div>
    {SystemMessageMap[messageJson.messageTerm]}
  </div>
</div>

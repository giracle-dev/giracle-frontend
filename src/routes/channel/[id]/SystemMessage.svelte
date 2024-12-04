<script lang="ts">
  export let messageContent = "";
  import { userListStore } from "$lib/store/user";

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
  } = JSON.parse(messageContent);
</script>

<div class="p-2">
  <div
    class="card bg-base-200 shadow-xl px-4 py-3 flex flex-row items-center gap-2"
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

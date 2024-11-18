<script lang="ts">
  import { page } from "$app/stores";
  import { userListStore } from "$lib/store/user";
  import type { IUser } from "$lib/types/IUser";
  import { onMount } from "svelte";

  let users: IUser[] = [];

  const getJoinedUser = () => {
    users = $userListStore.filter((user) =>
      user.ChannelJoin.some((c) => c.channelId === $page.params.id),
    );
  };

  onMount(() => getJoinedUser());
</script>

<div>
  チャンネル参加者リスト
  {#each users as user}
    <p>{user.name}</p>
  {/each}
</div>

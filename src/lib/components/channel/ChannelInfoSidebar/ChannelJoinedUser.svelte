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

<div class="flex flex-col gap-4">
  {#each users as user}
    <div class="flex flex-row items-center gap-3">
      <div class="avatar">
        <div class="w-8 rounded-full">
          <img alt="icon" src={`/api/user/icon/` + user.id} />
        </div>
      </div>
      <p class="truncate text-lg">{user.name}</p>
    </div>
  {/each}
</div>

<script lang="ts">
  import { onlineUserListStore, userListStore } from "$lib/store/user";
  import UserProfile from "$lib/components/unique/userProfile.svelte";

  //props
  interface Props {
    channelId: string;
  }

  let { channelId }: Props = $props();

  const getJoinedUser = (_channelId: string) => {
    return $userListStore.filter((user) =>
      user.ChannelJoin.some((c) => c.channelId === _channelId),
    );
  };
</script>

<div class="flex flex-col z-0 gap-4">
  {#each getJoinedUser(channelId) as user, index}
    <div class="flex flex-row items-center gap-3">
      <div class="dropdown dropdown-right dropdown-end z-40">
        <!-- アイコン表示 -->
        <div tabindex={index} role="button" class="w-15 mx-auto">
          <div
            class="avatar {$onlineUserListStore.find((v) => v === user.id) !==
            undefined
              ? 'online'
              : 'offline'} "
          >
            <div class="w-8 rounded-full">
              <img src="/api/user/icon/{user.id}" alt="userIcon" />
            </div>
          </div>
        </div>
        <div
          class="shadow m-0 p-0 absolute card card-compact dropdown-content bg-base-100 rounded-box w-64 z-50"
        >
          <UserProfile userId={user.id} />
        </div>
      </div>

      <p class="truncate text-lg">{user.name}</p>
    </div>
  {/each}
</div>

<script lang="ts">
  import { userListStore } from "$lib/store/user";
  import type { IUser } from "$lib/types/IUser";
  import { onlineUserListStore } from "$lib/store/user";
  import UserRoles from "./userProfile/UserRoles.svelte";

  export let userId: string | null = null;

  let user: IUser | null = null;

  $: {
    user = $userListStore.find((user) => user.id === userId) ?? null;
  }
</script>

<div class="bg-base p-2">
  {#if user === null}
    <div class="text-center">Loading...</div>
  {:else}
    <div class="w-58">
      <div class="relative h-[100px]">
        <div class="bg-primary w-full h-[80px] rounded-tl-lg rounded-tr-lg">
          <img
            src={"/api/user/banner/" + user.id}
            alt="banner"
            class="object-cover w-full h-[80px] rounded-tl-lg rounded-tr-lg"
          />
        </div>
        <div
          class="avatar absolute bottom-0 left-1
          {$onlineUserListStore.find((v) => v === userId) !== undefined
            ? 'online'
            : 'offline'}"
        >
          <div class="w-10 rounded-full relative">
            <img
              src={"/api/user/icon/" + user.id}
              alt="user"
              class="w-10 h-10 rounded-full object-cover"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full">
        <div class="text-lg font-bold">{user.name}</div>
        <div class="text-sm max-w-64">
          {user.selfIntroduction}
        </div>
      </div>

      <div>
        <UserRoles roleList={user.RoleLink} />
      </div>
    </div>
  {/if}
</div>

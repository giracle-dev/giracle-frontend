<script lang="ts">
  import { userListStore } from "$lib/store/user";
  import type { IUser } from "$lib/types/IUser";
  import { onlineUserListStore } from "$lib/store/user";
  import UserRoles from "./userProfile/UserRoles.svelte";
  import { createEventDispatcher } from "svelte";
  export let userId: string | null = null;
  export let canEditRole: boolean = false;
  let user: IUser | null = null;

  const dispatch = createEventDispatcher();

  $: {
    user = $userListStore.find((user) => user.id === userId) ?? null;
  }

  function onClickIcon(){
    dispatch('showUserProfileModal',{
      userId: userId
    });
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
            <button on:click={onClickIcon}>
              <img
                src={"/api/user/icon/" + user.id}
                alt="user"
                class="w-10 h-10 rounded-full object-cover"
              />
            </button>
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
        <UserRoles userId={user.id} roleList={user.RoleLink} canEditRole={canEditRole}/>
      </div>
    </div>
  {/if}
</div>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { IconSettings } from "@tabler/icons-svelte";
  import { goto } from "$app/navigation";
  import { myUserStore } from "$lib/store/myuser";
  import { get } from "svelte/store";
  import type { IChannel } from "$lib/types/IChannel";
  import { page } from "$app/stores";

  export let openDrawer: boolean = false;
  export let channelList: IChannel[];

  const dispatch = createEventDispatcher();

  function handleDrawer() {
    dispatch("drawer");
  }
</script>

<div class="drawer lg:drawer-open">
  <input
    id="my-drawer-2"
    type="checkbox"
    class="drawer-toggle"
    bind:checked={openDrawer}
    on:change={handleDrawer}
  />
  <div class="drawer-content w-full">
    <slot />
  </div>
  <div class="drawer-side">
    <label
      for="my-drawer-2"
      aria-label="close sidebar"
      class="drawer-overlay"
    />
    <div
      class=" menu bg-base-200 text-base-content min-h-full w-60 md:w-60 p-2"
    >
      <div class="h-[64px] border-b">serverInfo elements</div>
      <!-- Sidebar content here -->
      <ul class="h-[calc(100svh-144px)] overflow-y-auto py-2">
        <li><a href="/channel">チャンネル一覧</a></li>
        {#if channelList && channelList.length > 0}
          {#each channelList as channel}
            <li>
              <a href="/channel/{channel.id}"
                >{channel.name}
                {#if channel.id === $page.params.id}
                  <span class="badge badge-primary">&larr;</span>
                {/if}
              </a>
            </li>
          {/each}
        {/if}
      </ul>
      <!-- user -->
      <div
        class="bg-base-700 pa-2 flex items-center gap-2 h-[64px]"
        role="button"
        tabindex="0"
        on:click={() => {
          console.log("test userId->", get(myUserStore).id);
          goto("/user/" + get(myUserStore).id);
        }}
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            console.log("test");
          }
        }}
      >
        <img
          src="https://media.tenor.com/SgHXpt3rKfYAAAAi/grant-yapping.gif"
          alt="user"
          class="w-10 h-10 rounded-full"
        />
        <div class="w-[120px] truncate">User Name asdfadfadfasdfdaf</div>
        <div class="flex gap-2">
          <button
            class="btn btn-ghost btn-circle"
            on:click={(event) => {
              event.stopPropagation();
              goto("/setting");
            }}
          >
            <IconSettings size={20} />
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

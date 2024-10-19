<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import { authMiddleware, pwaMiddleware } from "$lib/middleware";
  import Drawer from "$lib/components/Drawer/Drawer.svelte";
  import Header from "$lib/components/Header/Header.svelte";
  import { page } from "$app/stores";
  // import { pwaAssetsHead } from "virtual:pwa-assets/head";
  import { pwaInfo } from "virtual:pwa-info";
  import { channelListStore } from "$lib/store/channel";
  import type { IChannel } from "$lib/types/IChannel";

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  const hiddenDefaultLayout = ["/signIn", "/signUp"];

  // パスを/で分割して配列にする

  function isSettingPage(): boolean {
    const pathArray = $page.url.pathname.split("/");
    if ($page.url.pathname.startsWith("/setting") && pathArray.length > 2) {
      console.log("isSettingPage", pathArray);
      return true;
    }
    return false;
  }

  let openDrawer = false;

  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  let headerTitle = "None Title";
  let headerIcon = "channel" as "channel" | "channelList";

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX = event.changedTouches[0].screenX;
    touchStartY = event.changedTouches[0].screenY;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    touchEndX = event.changedTouches[0].screenX;
    touchEndY = event.changedTouches[0].screenY;
    handleSwipeGesture();
  };

  const onChangeDrawer = () => {
    openDrawer = !openDrawer;
  };

  const handleSwipeGesture = () => {
    if (touchEndX - touchStartX > 50 && touchStartY - touchEndY < 50) {
      // 右スワイプ
      openDrawer = true;
    }
  };
  onMount(async () => {
    //middleware
    // await pwaMiddleware();
    await authMiddleware();
  });

  /**
   * チャンネル名を取得する
   * @param id
   */
  const getChannelName = (id: string): string => {
    let channel: IChannel | undefined;
    channelListStore.subscribe((channels) => {
      channel = channels.find((c) => c.id === id);
    })();
    if (channel) {
      return channel.name;
    }
    return "None Channel";
  };

  $: {
    switch ($page.url.pathname) {
      case "/channel":
        headerTitle = "Channel";
        headerIcon = "channelList";
        break;
      case `/channel/${$page.params.id}`:
        headerTitle = getChannelName($page.params.id);
        headerIcon = "channel";
        break;
      case "/setting":
        headerTitle = "Setting";
        headerIcon = "channel";
        break;
      default:
        headerTitle = "None Title";
        headerIcon = "channel";
        break;
    }
  }
</script>

<!-- <svelte:head>
  {#each pwaAssetsHead.links as link}
    <link {...link} />
  {/each}
  {@html webManifestLink}
</svelte:head> -->

{#if hiddenDefaultLayout.includes($page.url.pathname) || isSettingPage()}
  <slot />
{:else}
  <Drawer
    {openDrawer}
    on:drawer={() => {
      onChangeDrawer();
    }}
    channelList={$channelListStore}
  >
    <Header
      on:drawer={() => {
        onChangeDrawer();
      }}
      {headerTitle}
      {headerIcon}
    />
    <div
      on:touchstart={handleTouchStart}
      on:touchend={handleTouchEnd}
      class="h-[calc(100vh-64px)] overflow-y-auto"
    >
      <slot />
    </div>
  </Drawer>
{/if}

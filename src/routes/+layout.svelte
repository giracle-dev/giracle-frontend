<script lang="ts">
  import "../app.css";
  import { wsStatusStore } from "$lib/wsHandler/INIT.ws";
  import { onMount } from "svelte";
  import { authMiddleware, pwaMiddleware } from "$lib/middleware";
  import Drawer from "$lib/components/Drawer/Drawer.svelte";
  import Header from "$lib/components/Header/Header.svelte";
  import { page } from "$app/stores";
  import { pwaAssetsHead } from "virtual:pwa-assets/head";
  import { pwaInfo } from "virtual:pwa-info";
  import { channelListStore } from "$lib/store/channel";
  import type { IChannel } from "$lib/types/IChannel";
  import Toast from "$lib/components/unique/toast.svelte";
  import { themaStore } from "$lib/store/thema";
  import type { Theme } from "daisyui";
  import { changeThema } from "$lib/utils/thema";
  import { get } from "svelte/store";
  import { IconPlugX } from "@tabler/icons-svelte";
  import { hasAnyNewMessageDerived } from "$lib/store/messageReadTime";

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
    await pwaMiddleware();

    // localStorageに保存されているテーマを取得
    const lightTheme = localStorage.getItem("lightTheme") as Theme | null;
    const darkTheme = localStorage.getItem("darkTheme") as Theme | null;
    await themaStore.update((t) => {
      t.lightTheme = lightTheme ?? "light";
      t.darkTheme = darkTheme ?? "dark";
      return t;
    });

    await changeThema();

    //  Themaの設定
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", changeThema);

    console.log("layoutMiddlewareを実行します");
    await authMiddleware();
  });

  /**
   * チャンネル名を取得する
   * @param id
   */
  const getChannelName = (id: string): string => {
    let channel: IChannel | undefined;
    channel = $channelListStore.find((c) => c.id === id);
    console.log("channel", channel);
    if (channel) {
      return channel.name;
    }
    return "None Channel";
  };

  channelListStore.subscribe((value) => {
    if ($page.url.pathname === `/channel/${$page.params.id}`) {
      headerTitle = getChannelName($page.params.id);
      headerIcon = "channel";
    }
  });

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
      case "/search":
        headerTitle = "メッセージ検索";
        headerIcon = "channelList";
        break;
      case "/inbox":
        headerTitle = "通知一覧";
        headerIcon = "channelList";
        break;
      default:
        headerTitle = "";
        headerIcon = "channel";
        break;
    }
  }
</script>

<svelte:head>
  {#each pwaAssetsHead.links as link}
    <link {...link} />
  {/each}
  <title>
    {$hasAnyNewMessageDerived ? "*" : ""} Giracle
  </title>
  {@html webManifestLink}
</svelte:head>

<Toast />

{#if hiddenDefaultLayout.includes($page.url.pathname) || isSettingPage()}
  {#if $wsStatusStore === WebSocket.CLOSED}
    <div class="mx-2 mt-1">
      <div role="alert" class="alert alert-error">
        <IconPlugX />
        <p>サーバーから切断されました。再接続しています...</p>
      </div>
    </div>
  {/if}
  <slot />
{:else}
  <Drawer
    {openDrawer}
    on:drawer={() => {
      onChangeDrawer();
    }}
    channelList={$channelListStore}
  >
    <div
      on:touchstart={handleTouchStart}
      on:touchend={handleTouchEnd}
      class="h-screen flex flex-col"
    >
      {#if $wsStatusStore === WebSocket.CLOSED}
        <div class="mx-2 mt-1">
          <div role="alert" class="alert alert-error">
            <IconPlugX />
            <p>サーバーから切断されました。再接続しています...</p>
          </div>
        </div>
      {/if}
      <Header
        on:drawer={() => {
          onChangeDrawer();
        }}
        {headerTitle}
        {headerIcon}
      />
      <slot />
    </div>
  </Drawer>
{/if}

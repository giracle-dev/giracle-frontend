<script lang="ts">
  import "../app.css";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  // import { pwaAssetsHead } from "virtual:pwa-assets/head";
  import { pwaInfo } from "virtual:pwa-info";
  import { authMiddleware } from "$lib/middleware";
  import Drawer from "$lib/components/Drawer/Drawer.svelte";
  import Header from "$lib/components/Header/Header.svelte";
  import { page } from "$app/stores";
  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";
  const hiddenDefaultLayout = ["/signIn", "/signUp", "/setting"];
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
    // if (browser && "serviceWorker" in navigator) {
    //   navigator.serviceWorker
    //     .register("/service-worker.js", { type: "module" })
    //     .then((registration) => {
    //       console.info("サービスワーカーを登録しました:", registration.scope);
    //     })
    //     .catch((error) => {
    //       console.error("サービスワーカーが登録できませんでした:", error);
    //     });
    // }

    //middleware
    await authMiddleware();
  });

  $: {
    switch ($page.url.pathname) {
      case "/channel":
        headerTitle = "Channel";
        headerIcon = "channelList";
        break;
      case `/channel/${$page.params.id}`:
        headerTitle = "Channel Detail";
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

{#if hiddenDefaultLayout.includes($page.url.pathname)}
  <slot />
{:else}
  <Drawer
    {openDrawer}
    on:drawer={() => {
      onChangeDrawer();
    }}
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

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
  const hiddenDefaultLayout = ["/signIn", "/signUp"];
  let openDrawer = false;

  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

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

    //authのmiddleware
    await authMiddleware();
  });
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
    />
    <div
      on:touchstart={handleTouchStart}
      on:touchend={handleTouchEnd}
      class="h-full"
    >
      <slot />
    </div>
  </Drawer>
{/if}

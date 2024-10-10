<script lang="ts">
  import "../app.css";
  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { pwaAssetsHead } from "virtual:pwa-assets/head";
  import { pwaInfo } from "virtual:pwa-info";
  import {authMiddleware} from "$lib/middleware";

  $: webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : "";

  onMount(async() => {
    if (browser && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", { type: "module" })
        .then((registration) => {
          console.info("サービスワーカーを登録しました:", registration.scope);
        })
        .catch((error) => {
          console.error("サービスワーカーが登録できませんでした:", error);
        });
    }

    //authのmiddleware
    await authMiddleware();

  });

  let channelName: string = "";
</script>

<svelte:head>
  {#each pwaAssetsHead.links as link}
    <link {...link} />
  {/each}
  {@html webManifestLink}
</svelte:head>

<slot/>
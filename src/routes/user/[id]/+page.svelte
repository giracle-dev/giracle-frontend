<script lang="ts">
  import { myUserStore } from "$lib/store/myuser";
  import profileUpdate from "$lib/wsHandler/User/profileUpdate.ws";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let name = "";
  let description = "";

  //ユーザー情報を更新させる
  const updateIt = () => {
    profileUpdate({
      name,
      description,
    });
  };

  onMount(() => {
    const userId = $page.params.id;
    console.log(userId);
  });
</script>

<div>
  <h1>ユーザー</h1>
  <p>id: {$page.params.id}</p>

  <button on:click={updateIt}>更新</button>
</div>

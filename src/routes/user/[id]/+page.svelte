<script lang="ts">
  import { myUserStore } from "$lib/store/myuser";
  import profileUpdate from "$lib/wsHandler/User/profileUpdate.ws";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  let name = "";
  let selfIntroduction = "";

  //ユーザー情報を更新させる
  const updateIt = () => {
    profileUpdate({
      name,
      selfIntroduction,
    });
  };

  onMount(() => {
    const userId = $page.params.id;
    console.log(userId);

    //編集用にユーザー情報を取得
    selfIntroduction = get(myUserStore).selfIntroduction;
    name = get(myUserStore).name;
  });
</script>

<div>
  <h1>ユーザー</h1>
  <p>id: {$page.params.id}</p>

  <div>
    <div class="card-body">
      <textarea
        bind:value={selfIntroduction}
        class="textarea card bg-base-200"
        placeholder="自己紹介文"
      ></textarea>
    </div>
  </div>

  <button
    class="btn"
    disabled={selfIntroduction === get(myUserStore).selfIntroduction &&
      name === get(myUserStore).name}>更新</button
  >
</div>

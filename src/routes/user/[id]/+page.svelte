<script lang="ts">
  import { myUserStore } from "$lib/store/myuser";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  const userRepository = repositoryFactory.get("user");

  let name = "";
  let selfIntroduction = "";
  let processing = false;

  //ユーザー情報を更新させる
  const updateIt = async () => {
    //処理中フラグを立てる
    processing = true;
    //情報更新と取得
    const newUserinfo = await userRepository.updateProfile(
      name,
      selfIntroduction,
    );
    //console.log("/user/[id] :: updateIt : newUserinfo->", newUserinfo);

    //自分情報用のStoreへ格納
    myUserStore.set(newUserinfo.data);
    //処理中フラグを下げる
    processing = false;
  };

  onMount(() => {
    const userId = $page.params.id;
    console.log("/user/[id] :: onMount : userId->", userId);

    //編集用にユーザー情報を取得
    selfIntroduction = get(myUserStore).selfIntroduction;
    name = get(myUserStore).name;
  });
</script>

<div>
  <h1>ユーザー</h1>
  <p>name: {name}</p>
  <input
    bind:value={name}
    type="text"
    placeholder="あなたの名前"
    class="input input-bordered w-full"
  />
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
    on:click={updateIt}
    class="btn"
    disabled={(selfIntroduction === get(myUserStore).selfIntroduction &&
      name === get(myUserStore).name) ||
      name === "" ||
      selfIntroduction === "" ||
      processing}
  >
    {processing ? "処理中..." : "更新"}
  </button>
</div>

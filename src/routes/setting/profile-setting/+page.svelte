<script lang="ts">
  import { myUserStore } from "$lib/store/user";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { goto } from "$app/navigation";
  import { IconSettings } from "@tabler/icons-svelte";
  const userRepository = repositoryFactory.get("user");

  let iconObj: File | null = null;
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
    myUserStore.update((user) => {
      return {
        ...user,
        name: newUserinfo.data.name,
        selfIntroduction: newUserinfo.data.selfIntroduction,
      };
    });
    //処理中フラグを下げる
    processing = false;
  };

  const changeProfileIcon = () => {
    if (iconObj !== null)
      userRepository.changeIcon(iconObj).then((response) => {
        console.log(
          "/user/[id] :: changeProfileIcon : アイコン変更に成功しました！",
          response,
        );
      });
  };

  //画像ファイル受け取り
  const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      console.log("Selected file:", file);
      // ファイル処理をここに追加
      iconObj = file;
    }
  };

  onMount(() => {
    //編集用にユーザー情報を取得
    selfIntroduction = get(myUserStore).selfIntroduction;
    name = get(myUserStore).name;
  });

  myUserStore.subscribe((value) => {
    name = value.name;
    selfIntroduction = value.selfIntroduction;
  });
</script>

<div>
  <div class="w-full h-10 flex gap-2 items-center">
    <button
      class="btn btn-ghost"
      on:click={() => {
        goto("/setting");
      }}
    >
      <IconSettings size={20} />
    </button>
    <h1 class="text-2xl font-bold">ユーザー</h1>
  </div>

  <hr />

  <div class="card bg-base-200 max-w-[350px] mx-auto m-2">
    <div class="card-body">
      <p>アバター</p>
      <div class="avatar mx-auto">
        <div class="w-24 rounded-xl">
          <img src={`/api/user/icon/${$myUserStore.id}`} alt="icon" />
        </div>
      </div>
      <input
        on:change={handleFileChange}
        type="file"
        class="file-input file-input-bordered w-full"
      />
      <div class="card-actions justify-end">
        <button on:click={changeProfileIcon} class="btn btn-primary"
          >アップロード</button
        >
      </div>
    </div>
  </div>

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

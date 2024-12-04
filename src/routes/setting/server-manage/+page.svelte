<script lang="ts">
  import type { IServer } from "$lib/types/IServer";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { afterUpdate, onMount } from "svelte";
  import {
    IconSettings,
    IconEggFilled,
    IconMessageChatbotFilled,
    IconList,
    IconBellFilled,
  } from "@tabler/icons-svelte";
  import { toastStore } from "$lib/store/toast";
  import { goto } from "$app/navigation";
  import SearchChannelAndSelect from "$lib/components/unique/SearchChannelAndSelect.svelte";
  import type { IChannel } from "$lib/types/IChannel";
  import { channelListStore } from "$lib/store/channel";
  import { get } from "svelte/store";
  const serverRepository = repositoryFactory.get("server");

  //バナー画像
  let bannerImageObj: FileList | null = null;
  //比較用の元データ
  let serverConfigNow: IServer = {
    name: "サンプルサーバー",
    introduction: "サンプルサーバーです",
    RegisterAvailable: true,
    RegisterInviteOnly: false,
    MessageMaxLength: 5000,
    defaultJoinChannel: [],
    RegisterAnnounceChannelId: "",
  };
  //サーバー設定
  let serverConfig: IServer = {
    name: "",
    introduction: "",
    RegisterAvailable: false,
    RegisterInviteOnly: false,
    MessageMaxLength: 0,
    defaultJoinChannel: [],
    RegisterAnnounceChannelId: "",
  };
  let defaultJoinChannelArr: IChannel[] = [];
  let registerAnnounceChannel: IChannel[] = [];
  let configChanged = false;

  //サーバー設定が更新されたと設定
  const setChanged = () => {
    /*
    console.log(
      "setChanged",
      JSON.stringify(serverConfig),
      JSON.stringify(serverConfigNow),
    );
    */
    configChanged =
      JSON.stringify(serverConfig) !== JSON.stringify(serverConfigNow);
  };

  $: if (defaultJoinChannelArr && registerAnnounceChannel) {
    for (const channel of defaultJoinChannelArr) {
      if (
        serverConfigNow.defaultJoinChannel.findIndex(
          (c) => c.id === channel.id,
        ) === -1
      ) {
        configChanged = true;
        break;
      }
    }
    if (
      serverConfigNow.RegisterAnnounceChannelId !==
      registerAnnounceChannel[0]?.id
    ) {
      configChanged = true;
    }
  }

  //サーバー設定を取得
  const fetchServerConfig = async () => {
    await serverRepository
      .getConfig()
      .then((res) => {
        serverConfigNow = structuredClone(res.data);
        serverConfig = res.data;
        defaultJoinChannelArr = structuredClone(res.data.defaultJoinChannel);
        registerAnnounceChannel = get(channelListStore).filter(
          (c) => c.id === serverConfig.RegisterAnnounceChannelId,
        );
        setChanged();
      })
      .catch((err) => {
        console.log(
          "/setting/server-manage :: fetchServerConfig : エラー->",
          err,
        );
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "サーバー設定の取得に失敗しました!",
              type: "error",
            },
          ];
        });
      });
  };

  //サーバー設定を更新
  const updateServerConfig = async () => {
    await serverRepository
      .changeInfo(serverConfig.name, serverConfig.introduction)
      .then((res) => {
        fetchServerConfig();
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "サーバー設定を更新しました!",
              type: "success",
            },
          ];
        });
      })
      .catch((err) => {
        console.log(
          "/setting/server-manage :: updateServerConfig(changeInfo) : エラー->",
          err,
        );
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "サーバー設定の更新に失敗しました!",
              type: "error",
            },
          ];
        });
      });
    await serverRepository
      .changeConfig(
        serverConfig.RegisterAvailable,
        serverConfig.RegisterInviteOnly,
        registerAnnounceChannel[0]?.id,
        serverConfig.MessageMaxLength,
        defaultJoinChannelArr.map((c) => c.id),
      )
      .then((res) => {
        fetchServerConfig();
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "サーバー設定を更新しました!",
              type: "success",
            },
          ];
        });
      })
      .catch((err) => {
        console.log(
          "/setting/server-manage :: updateServerConfig(changeConfig) : エラー->",
          err,
        );
        toastStore.update((t) => {
          return [
            ...t,
            {
              message: "サーバー設定の更新に失敗しました!",
              type: "error",
            },
          ];
        });
      });
  };

  afterUpdate(() => {
    //console.log("afterUpdate", JSON.stringify(serverConfig));
  });

  //サーバーバナーを変更する
  const changeServerBanner = async () => {
    if (bannerImageObj) {
      await serverRepository
        .changeBanner(bannerImageObj[0])
        .then((res) => {
          toastStore.update((t) => {
            return [
              ...t,
              {
                message: "サーバーバナーを更新しました!",
                type: "success",
              },
            ];
          });
        })
        .catch((err) => {
          alert("サーバーバナーの更新に失敗しました!" + err);
          console.log(
            "/setting/server-manage :: changeServerBanner : エラー->",
            err,
          );
        });
    }
  };

  onMount(() => {
    fetchServerConfig();
  });
</script>

<div class="p-2 mx-auto max-w-[850px] flex flex-col gap-3">
  <div class="card bg-base-200 p-3 flex flex-row items-center">
    <button
      class="btn btn-ghost w-16"
      on:click={() => {
        goto("/setting");
      }}
    >
      <IconSettings size={20} />
    </button>
    <p class="card-title">サーバー管理</p>
  </div>

  <div class="card bg-base-200">
    <div class="card-body">
      <div class="card-title">サーバーインスタンス名</div>
      <input
        bind:value={serverConfig.name}
        on:change={setChanged}
        type="text"
        class="input input-bordered"
      />
    </div>
  </div>

  <div
    class="card bg-base-200 image-full shadow-xl max-h-[250px] overflow-hidden w-full bg-[url('/api/server/banner')]"
  >
    <div
      class="card-body flex w-min flex-col items-center justify-center mx-auto"
    >
      <p class="font-bold">サーバーバナーを変更する</p>
      <input
        bind:files={bannerImageObj}
        type="file"
        accept="image/*"
        class="file-input w-fit file-input-ghost max-w-[250px]"
      />
      <button on:click={changeServerBanner} class="btn glass mt-2">
        変更する!
      </button>
    </div>
  </div>

  <div class="card bg-base-200">
    <div class="card-body">
      <p class="text-xl font-bold">サーバー紹介文</p>
      <textarea
        bind:value={serverConfig.introduction}
        on:change={setChanged}
        class="textarea textarea-bordered"
        placeholder="Bio"
      ></textarea>
    </div>
  </div>

  <div class="card bg-base-200">
    <div class="card-body">
      <div class="text-xl font-bold">サーバー設定</div>

      <span class="text-xl font-bold flex flex-row items-center">
        <IconEggFilled size={24} />
        新規登録
      </span>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">新規登録を受け付ける</span>
          <input
            type="checkbox"
            class="toggle"
            bind:checked={serverConfig.RegisterAvailable}
            on:change={setChanged}
          />
        </label>
        <label class="label cursor-pointer">
          <span class="label-text">
            登録を招待制にする<br />
            <a href="/setting/invite-setting" class="link text-sm">
              招待コード管理へ
            </a>
          </span>
          <input
            type="checkbox"
            class="toggle"
            disabled={!serverConfig.RegisterAvailable}
            bind:checked={serverConfig.RegisterInviteOnly}
            on:change={setChanged}
          />
        </label>
      </div>

      <div class="divider" />

      <span class="text-xl font-bold flex flex-row items-center">
        <IconMessageChatbotFilled size={24} />
        メッセージ
      </span>
      <span class="flex flex-row items-center">
        メッセージの最大文字数
        <input
          bind:value={serverConfig.MessageMaxLength}
          on:change={setChanged}
          type="number"
          class="input input-bordered w-1/2 ml-auto"
        />
      </span>
      <input
        bind:value={serverConfig.MessageMaxLength}
        on:change={setChanged}
        type="range"
        min="0"
        max="10000"
        class="range"
        step="1250"
      />
      <div class="flex w-full justify-between px-2 text-xs">
        <span>0</span>
        <span>1250</span>
        <span>2500</span>
        <span>3750</span>
        <span>5000</span>
        <span>6250</span>
        <span>7500</span>
        <span>8750</span>
        <span>10000</span>
      </div>

      <div class="divider" />

      <span class="text-xl font-bold flex flex-row items-center">
        <IconList size={24} />
        デフォルト参加チャンネル
      </span>
      <div>
        <SearchChannelAndSelect bind:selection={defaultJoinChannelArr} />
      </div>

      <div class="divider" />

      <span class="text-xl font-bold flex flex-row items-center">
        <IconBellFilled size={24} />
        新規登録時の通知チャンネル
      </span>
      <div>
        <SearchChannelAndSelect bind:selection={registerAnnounceChannel} />
      </div>
    </div>
  </div>

  {#if configChanged}
    <div class="card bg-base-200 mx-auto w-full max-w-[500px]">
      <div class="card-body w-full flex xs:flex-col sm:flex-row gap-3">
        <button
          on:click={() => {
            serverConfig = structuredClone(serverConfigNow);
            registerAnnounceChannel = get(channelListStore).filter(
              (c) => c.id === serverConfig.RegisterAnnounceChannelId,
            );
            setChanged();
          }}
          class="btn grow">元に戻す</button
        >
        <button on:click={updateServerConfig} class="btn btn-primary grow"
          >更新</button
        >
      </div>
    </div>
  {/if}
</div>

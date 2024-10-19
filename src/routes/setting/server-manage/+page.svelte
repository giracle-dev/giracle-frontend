<script lang="ts">
  import type { IServer } from "$lib/types/IServer";
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { onMount } from "svelte";
  import {
    IconSettings,
    IconEggFilled,
    IconMessageChatbotFilled,
  } from "@tabler/icons-svelte";
  import { goto } from "$app/navigation";
  const serverRepository = repositoryFactory.get("server");

  //比較用の元データ
  let serverConfigNow: IServer = {
    name: "サンプルサーバー",
    introduction: "サンプルサーバーです",
    RegisterAvailable: true,
    RegisterInviteOnly: false,
    MessageMaxLength: 5000,
  };
  //サーバー設定
  let serverConfig: IServer = {
    name: "",
    introduction: "",
    RegisterAvailable: false,
    RegisterInviteOnly: false,
    MessageMaxLength: 0,
  };
  let configChanged = false;

  //サーバー設定が更新されたと設定
  const setChanged = () => {
    console.log(
      "setChanged",
      JSON.stringify(serverConfig),
      JSON.stringify(serverConfigNow),
    );
    configChanged =
      JSON.stringify(serverConfig) !== JSON.stringify(serverConfigNow);
  };

  //サーバー設定を取得
  const fetchServerConfig = async () => {
    await serverRepository
      .getConfig()
      .then((res) => {
        serverConfigNow = structuredClone(res.data);
        serverConfig = res.data;
        setChanged();
      })
      .catch((err) => {
        console.log(
          "/setting/server-manage :: fetchServerConfig : エラー->",
          err,
        );
        alert("サーバー設定の取得に失敗しました!\n" + err);
      });
  };

  //サーバー設定を更新
  const updateServerConfig = async () => {
    await serverRepository
      .changeInfo(serverConfig.name, serverConfig.introduction)
      .then((res) => {
        fetchServerConfig();
      })
      .catch((err) => {
        console.log(
          "/setting/server-manage :: updateServerConfig(changeInfo) : エラー->",
          err,
        );
        alert("サーバー設定の更新に失敗しました!\n" + err);
      });
    await serverRepository
      .changeConfig(
        serverConfig.RegisterAvailable,
        serverConfig.RegisterInviteOnly,
        serverConfig.MessageMaxLength,
      )
      .then((res) => {
        fetchServerConfig();
      })
      .catch((err) => {
        console.log(
          "/setting/server-manage :: updateServerConfig(changeConfig) : エラー->",
          err,
        );
        alert("サーバー設定の更新に失敗しました!\n" + err);
      });
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
    </div>
  </div>

  {#if configChanged}
    <div class="card bg-base-200 mx-auto w-full max-w-[500px]">
      <div class="card-body w-full flex xs:flex-col sm:flex-row gap-3">
        <button
          on:click={() => {
            serverConfig = structuredClone(serverConfigNow);
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

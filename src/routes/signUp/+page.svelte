<script lang="ts">
  import { preventDefault } from 'svelte/legacy';

  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  let username = $state("");
  let password = $state("");
  let message = $state("");
  let inviteCode = $state("");

  const userRepository = repositoryFactory.get("user");

  const signUp = async () => {
    try {
      const response = await userRepository.signUp(
        username,
        password,
        inviteCode,
      );
      if (response) {
        console.log(response);
        message = "サインアップに成功しました！";
        goto("/signIn");
      } else {
        message = "サインアップに失敗しました。";
      }
    } catch (error) {
      message = "エラーが発生しました。";
    }
  };
</script>

<div
  class="flex items-center justify-center min-h-screen bg-base-300 bg-opacity-20"
>
  <div class="absolute top-0 right-0 z-[-1]">
    <img
      src="/api/server/banner"
      alt="icon"
      class="w-screen h-screen object-cover"
    />
  </div>
  <div
    class="w-full max-w-md m-2 p-8 space-y-6 rounded shadow-md m-5 bg-base-100 bg-opacity-60 glass"
  >
    <h2 class="text-2xl font-bold text-center">サインアップ</h2>
    <form onsubmit={preventDefault(signUp)} class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium"
          >招待コード</label
        >
        <input
          type="text"
          id="inviteCode"
          bind:value={inviteCode}
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label for="username" class="block text-sm font-medium"
          >ユーザー名</label
        >
        <input
          type="text"
          id="username"
          bind:value={username}
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium"
          >パスワード</label
        >
        <input
          type="password"
          id="password"
          bind:value={password}
          class="w-full px-3 py-2 mt-1 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <button
        type="submit"
        class="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        サインアップ
      </button>
    </form>
    {#if message}
      <p class="mt-4 text-center text-red-500">{message}</p>
    {/if}
    <!-- サインインページ -->
    <div class="text-center">
      <a href="/signIn" class="text-indigo-600">既にアカウントがある</a>
    </div>
  </div>
</div>

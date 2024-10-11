<script>
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import { goto } from "$app/navigation";

  let username = "";
  let password = "";

  const signIn = async () => {
    const userRepository = repositoryFactory.get("user");
    const response = await userRepository.signIn(username, password);
    if (response.success) {
      console.log("サインインに成功しました！");
      goto("/");
    } else {
      console.log("サインインに失敗しました。");
    }
  };
</script>

<div class="flex items-center justify-center min-h-screen">
  <div class="w-full max-w-md p-8 space-y-6 rounded shadow-md">
    <h2 class="text-2xl font-bold text-center">サインインページ</h2>
    <form class="space-y-6" on:submit|preventDefault={signIn}>
      <div>
        <label for="username" class="block text-sm font-medium"
          >ユーザー名</label
        >
        <input
          type="text"
          id="username"
          bind:value={username}
          class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          class="w-full px-3 py-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <button
          type="submit"
          class="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >サインイン</button
        >
      </div>
    </form>
  </div>
</div>

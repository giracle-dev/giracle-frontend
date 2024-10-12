import { goto } from "$app/navigation";
import { repositoryFactory } from "./repositories/RepositoryFactory";
import { channelListStore } from "./store/channel";

const userRepository = repositoryFactory.get("user");
const channelRepository = repositoryFactory.get("channel");

/**
 * 認証クリア後の初期実行処理
 */
const init = async () => {
  // チャンネル一覧を取得
  await channelRepository.getChannel().then((response) => {
    console.log(response);
    channelListStore.set(response.data);
  });
};

/**
 * ログインしていない場合はログインページにリダイレクトするミドルウェア
 * @returns
 * */
export const authMiddleware = async () => {
  // リダイレクトしないリスト
  const noRedirectList = ["/signIn", "/signUp"];

  // ログイン画面で認証できる場合はリダイレクトする
  if (noRedirectList.includes(location.pathname)) {
    await userRepository
      .verifyToken()
      .then((response) => {
        if (response.success) {
          goto("/");
        }
      })
      .catch(() => {
        console.log("error");
      });
  }

  // 認証処理
  if (!noRedirectList.includes(location.pathname)) {
    await userRepository
      .verifyToken()
      .then((response) => {
        console.log(response);
        // ログインしていない場合はログインページにリダイレクト
        if (!response.success && !noRedirectList.includes(location.pathname)) {
          goto("/signIn");
        } else {
          init();
        }
      })
      .catch(() => {
        if (!noRedirectList.includes(location.pathname)) {
          goto("/signIn");
        }
      });
  }
};

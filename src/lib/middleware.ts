import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { repositoryFactory } from "./repositories/RepositoryFactory";
import { channelListStore } from "./store/channel";
import { initWS } from "./wsHandler/INIT.ws";
import { myUserStore } from "./store/myuser";
import { get } from "svelte/store";
import type { IResponseUSerVerifyToken } from "./types/IUser";

const userRepository = repositoryFactory.get("user");
const channelRepository = repositoryFactory.get("channel");

export const pwaMiddleware = async () => {
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
};

/**
 * 認証クリア後の初期実行処理
 */
const init = async () => {
  //自分のユーザー情報の取得
  userRepository.getUserInfo(get(myUserStore).id).then((response) => {
    console.log(
      "middleware :: authMiddleware : response(getUserInfo)->",
      response,
    );
    myUserStore.set({ ...get(myUserStore), ...response.data });
  });
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
    await userRepository.verifyToken().then((response) => {
      if (response) {
        initWS();
        init();
        goto("/channel");
      }
    });
  }

  // 認証処理
  if (!noRedirectList.includes(location.pathname)) {
    await userRepository
      .verifyToken()
      .then((response: IResponseUSerVerifyToken) => {
        console.log("middleware :: authMiddleware : response->", response);

        //WebSocketの初期化
        initWS();
        //自分のユーザーIdをストアにセット
        myUserStore.set({ ...get(myUserStore), id: response.data.userId });

        // ログインしていない場合はログインページにリダイレクト
        if (!response && !noRedirectList.includes(location.pathname)) {
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

import { goto } from "$app/navigation";
import { browser } from "$app/environment";
import { repositoryFactory } from "./repositories/RepositoryFactory";
import { channelListStore } from "./store/channel";
import { initWS } from "./wsHandler/INIT.ws";
import { myUserStore, onlineUserListStore, userListStore } from "./store/user";
import { get } from "svelte/store";
import type { IResponseUSerVerifyToken } from "./types/IUser";
import { serverInfoStore } from "./store/serverInfo";
import messageRepository from "./repositories/messageRepository";
import { hasNewMessageStore, MessageReadTimeStore, MessageReadTimeBeforeStore } from "./store/messageReadTime";

const userRepository = repositoryFactory.get("user");
const channelRepository = repositoryFactory.get("channel");
const serverRepository = repositoryFactory.get("server");

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
export const init = async () => {
  //自分のユーザー情報の取得
  userRepository.getUserInfo(get(myUserStore).id).then((response) => {
    console.log(
      "middleware :: authMiddleware : response(getUserInfo)->",
      response,
    );
    myUserStore.set({ ...get(myUserStore), ...response.data });
  });
  //新着があるか調べる
  await messageRepository.getHasNewMessage().then((response) => {
    console.log("middleware :: init : response(getHasNewMessage)->", response);
    hasNewMessageStore.set(response.data);
  });
  //既読時間を取得
  await messageRepository.getReadTime().then((response) => {
    for (const data of response.data) {
      console.log("middleware :: init : response(getReadTime)->", data);
      MessageReadTimeStore.update((store) => {
        store[data.channelId] = structuredClone(data).readTime;
        return store;
      });
      MessageReadTimeBeforeStore.update((store) => {
        store[data.channelId] = structuredClone(data).readTime;
        return store;
      });
    }
  });
  // チャンネル一覧を取得
  await channelRepository.getChannel().then((response) => {
    console.log(response);
    channelListStore.set(response.data);
  });
  // ユーザー一覧取得
  await userRepository.userList().then((response) => {
    userListStore.set(response.data);
  });
  // サーバー情報取得
  await serverRepository.getConfig().then((response) => {
    console.log(response);
    serverInfoStore.set(response.data);
  });
  //オンラインユーザー情報取得
  await userRepository.getOnline().then((response) => {
    console.log(
      "middleware :: authMiddleware : response(getOnline)->",
      response,
    );
    onlineUserListStore.set(response.data);
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

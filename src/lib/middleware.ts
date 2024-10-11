import { goto } from "$app/navigation";
import { repositoryFactory } from "./repositories/RepositoryFactory";

const userRepository = repositoryFactory.get("user");

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
        }
      })
      .catch(() => {
        if (!noRedirectList.includes(location.pathname)) {
          goto("/signIn");
        }
      });
  }
};

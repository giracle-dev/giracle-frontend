import { goto } from "$app/navigation";

/**
 * ログインしていない場合はログインページにリダイレクトするミドルウェア
 * @returns
 * */
export const authMiddleware = () => {
  // リダイレクトしないリスト
  const noRedirectList = ["/signIn", "/signUp"];

  // クッキーがない場合はログインページにリダイレクト
  //   if (!noRedirectList.includes(location.pathname)) {
  //     goto("/signIn");
  //   }
};

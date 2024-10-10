import { goto } from "$app/navigation";


/**
 * ログインしていない場合はログインページにリダイレクトするミドルウェア
 * @returns
 * */
export const authMiddleware = () => {
    // クッキーがあるかどうかを確認
    const cookie = document.cookie;

    // クッキーがない場合はログインページにリダイレクト
    if (!cookie) {
        goto("/signIn");
    }
}
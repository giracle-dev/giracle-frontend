/**
 * 容量サイズを人間が読みやすい形式に変換する
 * @param size - 容量サイズ
 * @returns 
 */
export default function displaySizeForHuman(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}
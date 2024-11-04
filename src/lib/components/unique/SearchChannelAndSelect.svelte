<script lang="ts">
  import { repositoryFactory } from "$lib/repositories/RepositoryFactory";
  import type { IChannel } from "$lib/types/IChannel";
  const channelRepository = repositoryFactory.get("channel");

  let result: IChannel[] = []; //検索結果格納用
  let selection: IChannel[] = []; //結果から選択されたチャンネルを格納
  let query = ""; //検索クエリ

  /**
   * チャンネルを検索する
   */
  const searchChannel = () => {

  }
</script>

<div>
  <input type="text" placeholder="Search for a channel" />
  <button>Search</button>
</div>
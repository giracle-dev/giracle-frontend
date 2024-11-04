<script lang="ts">
  import type { IUser } from "$lib/types/IUser";

  export let user: IUser | null = null;
</script>

<div class="w-3/4 h-3/4 mx-auto mt-20 relative bg-base-100 card">
  {user?.name}test
</div>

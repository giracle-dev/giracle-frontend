<script lang="ts">
  import RoleChip from "$lib/components/unique/RoleChip.svelte";
  export let roleList: { roleId: string }[] = [];
</script>

<div>
  {#each roleList as roleData}
    <RoleChip roleId={roleData.roleId} />
  {/each}
</div>

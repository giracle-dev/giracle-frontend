<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { IconTextWrapDisabled } from "@tabler/icons-svelte";

  export let hedaerTitle: string = "Navbar Title";

  const dispatch = createEventDispatcher();

  function handleDrawer() {
    dispatch("drawer");
  }
</script>

<div class="navbar h-8 bg-base-300 w-full">
  <div class="flex-none lg:hidden">
    <button class="px-2" on:click={handleDrawer}>
      <IconTextWrapDisabled size={20} />
    </button>
  </div>
  <div class="mx-2 flex-1 px-2"># Navbar Title</div>
  <div class="hidden flex-none lg:block">
    <ul class="menu menu-horizontal">
      <!-- Navbar menu content here -->
      <li>ltem</li>
    </ul>
  </div>
</div>

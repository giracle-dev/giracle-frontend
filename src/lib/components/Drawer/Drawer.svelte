<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let openDrawer: boolean = false;

  const dispatch = createEventDispatcher();

  function handleDrawer() {
    dispatch("drawer");
  }
</script>

<div class="drawer lg:drawer-open">
  <input
    id="my-drawer-2"
    type="checkbox"
    class="drawer-toggle"
    bind:checked={openDrawer}
    on:change={handleDrawer}
  />
  <div class="drawer-content w-full">
    <slot />
  </div>
  <div class="drawer-side">
    <label
      for="my-drawer-2"
      aria-label="close sidebar"
      class="drawer-overlay"
    />
    <ul class="menu bg-base-200 text-base-content min-h-full w-40 md:w-60 p-4">
      <!-- Sidebar content here -->
      <li><a href="/channel">Sidebar Item 1</a></li>
    </ul>
  </div>
</div>

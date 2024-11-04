<script lang="ts">
  /**
   * ここはピュアコンポーネントです
   * 処理を追加しないでください
   * またglobal-modalなのでlayout以外置かないようにしてください
   */
  import { createEventDispatcher } from "svelte";

  export let isActiveGlobalModal: boolean = true;
  const dispatch = createEventDispatcher();

  function onClickOutModal() {
    console.log("isCloseGlobalModal");
    dispatch("isCloseModal");
  }
</script>

<div id="modal" class={isActiveGlobalModal ? "block" : "hidden"}>
  <button class="absolute top-0 right-0" />
  <div class="block w-full h-full bg-black/70 absolute top-0 left-0">
    <slot />
  </div>
</div>

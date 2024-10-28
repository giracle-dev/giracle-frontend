<script lang="ts">
  export let fileData: File;
</script>

<div class="card bg-base-200 px-3 py-2">
  {#if fileData.type.startsWith("image/")}
    <figure>
      <img
        src={URL.createObjectURL(fileData)}
        alt={fileData.name}
        class="max-h-[150px] max-w-[150px]"
      />
    </figure>
  {/if}

  <p>
    {fileData.name.length > 15
      ? fileData.name.slice(0, 15) + "..."
      : fileData.name}
  </p>
</div>

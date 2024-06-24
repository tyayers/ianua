<script lang="ts">
  export let data: string[] = [];
  export let onRemove: (tag: string) => void;
</script>

<div class="cloud_box">
  {#each data as tag}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <span class="cloud_tag">
    <svg class="cloud_remove_button" on:click={() => {onRemove(tag)}} width="18px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M512 897.6c-108 0-209.6-42.4-285.6-118.4-76-76-118.4-177.6-118.4-285.6 0-108 42.4-209.6 118.4-285.6 76-76 177.6-118.4 285.6-118.4 108 0 209.6 42.4 285.6 118.4 157.6 157.6 157.6 413.6 0 571.2-76 76-177.6 118.4-285.6 118.4z m0-760c-95.2 0-184.8 36.8-252 104-67.2 67.2-104 156.8-104 252s36.8 184.8 104 252c67.2 67.2 156.8 104 252 104 95.2 0 184.8-36.8 252-104 139.2-139.2 139.2-364.8 0-504-67.2-67.2-156.8-104-252-104z" fill=""></path><path d="M707.872 329.392L348.096 689.16l-31.68-31.68 359.776-359.768z" fill=""></path><path d="M328 340.8l32-31.2 348 348-32 32z" fill=""></path></g></svg>  
    {tag}
  </span>
  {/each}
</div>

<style>
  .cloud_box {
    margin-top: 18px;

  }

  .cloud_tag {
    background: lightgreen;
    padding: 4px;
    margin: 2px;
    border-radius: 24px;
    border: green 1px solid;
    padding-right: 9px;
  }

  .cloud_remove_button {
    position: relative; 
    top: 4px;
    cursor: pointer;
    /* fill: #8c8c8c; */
    fill: black;
  }
</style>
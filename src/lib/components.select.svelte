<script lang="ts">
  import { onMount } from "svelte";


  export let data: string[] = [];
  export let selectedData: string = "";
  export let multi: boolean = false;

  let menuVisible: boolean = false;
  let ignoreNextCancel: boolean = false;

  onMount(async () => {
    document.addEventListener("cancelEvent", () => {
      if (!ignoreNextCancel) menuVisible = false;
      ignoreNextCancel = false;
    });
  });

  function clickMenu() {
    // document.dispatchEvent(new Event('cancelEvent'));
    ignoreNextCancel = true;
    menuVisible = !menuVisible;
  }

  function clickOption(option: string) {
    if (multi) {
      let options: string[] = selectedData.split(",");
      if (selectedData.includes(option)) {
        let index = options.indexOf(option);
        options.splice(index, 1);
      } else {
        options.push(option);
      }

      selectedData = options.join(",");
    }
    else {
      selectedData = option;
      menuVisible = false;
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="field" on:click={clickMenu}>

  {selectedData}

  <!-- svelte-ignore a11y-missing-attribute -->
  <span class="arrow"></span>
</div>

{#if menuVisible}
  <div class="menu">
    {#each data as option}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div style="padding-top: 4px; padding-bottom: 4px; display: flex;" on:click|stopPropagation={()=>clickOption(option)}>
        {#if multi && selectedData.includes(option)}
          <span>{option}</span><span class="option_check"><svg width="17px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.6111L8.92308 17.5L20 6.5" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg></span>
        {:else}
          <span>{option}</span><span></span>
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .field {
    background-color: #f0f0f0;
    min-width: 176px;
    min-height: 20px;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
  }

  .menu {
    position: absolute;
    margin-top: 4px;
    z-index: 2;
    padding: 12px;
    background-color: white;
    min-width: 200px;
    width: 300px;
    background: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;
    border: 1px solid rgb(242, 242, 242);
    cursor: pointer;
  }

  .arrow {
    position: relative;
    right: -12px;
    top: 10px;
    float: right;
  }

  .arrow:after {
    content: "";
    position: absolute;
    top: 50%;
    right: 8px;
    width: 0;
    height: 0;
    margin-top: -2px;
    border-top: 5px solid #aaa;
    border-right: 5px solid transparent;
    border-left: 5px solid transparent;
  }

  .option_check {
    position: absolute;
    right: 12px;
  }
</style>
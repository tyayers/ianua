<script lang="ts">
  import Select from "$lib/components.select.svelte";
  import { SortTypes } from "./interfaces";

  export let categories: string[] = [];
  export let topics: string[] = [];
  export let types: string[] = [];
  
  export let selectedSort: string = "";
  export let selectedCategories: string[] = [];
  export let selectedTopics: string[] = [];
  export let selectedTypes: string[] = [];
  export let refresh: () => void;
  export let sort: (direction: string) => void;
  export let reset: () => void;

  let initialSelectedSort = selectedSort;

  // reactive sort listener
  $: {
    if (sort && selectedSort) sort(selectedSort);
  }

  function onCheckChange(collection: string[], e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];
    let tempChecked = collection;

    if (e.target.checked) {
      if (!tempChecked.includes(name)){
        tempChecked.push(name);
      }
    }
    else {
      if (tempChecked.includes(name)) {
        let index = collection.indexOf(name);
        tempChecked.splice(index, 1);
      }
    }

    collection = tempChecked;
    if (refresh) refresh();
  }

  function checkChecked(collection: string[], value: string) {
    let result: boolean = false;
    if (collection.includes(value)) result = true;
    return result;
  }

  function resetFilter() {
    if (reset) reset();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click|stopPropagation={() => {}}>

  <button class="rounded_button_outlined" on:click={resetFilter} style="margin-top: 14px; margin-bottom: 8px; padding-top: 8px; padding-bottom: 8px;">Reset filter</button>

  {#if categories.length > 0}
    <h4>Sort</h4>
    <div class="form_list">
      <div class="select_dropdown">
        <Select data={Object.values(SortTypes)} bind:selectedData={selectedSort} />
      </div>
    </div>

    <h4>Categories</h4>
    {#each categories as category}
      <div class="product_filter_checkbox">
        <input type="checkbox" id={category} name={category} on:change={(e) => onCheckChange(selectedCategories, e)} checked={checkChecked(selectedCategories, category)} /><label for={category}>{category}</label>
      </div>
    {/each}

    <h4>Topics</h4>
    {#each topics as topic}
      <div class="product_filter_checkbox">
        <input type="checkbox" id={topic} name={topic} on:change={(e) => onCheckChange(selectedTopics, e)} checked={checkChecked(selectedTopics, topic)} /><label for={topic}>{topic}</label>
      </div>
    {/each}

    <h4>Types</h4>
    {#each types as type}
      <div class="product_filter_checkbox">
        <input type="checkbox" id={type} name={type} on:change={(e) => onCheckChange(selectedTypes, e)} checked={checkChecked(selectedTypes, type)} /><label for={type}>{type}</label>
      </div>
    {/each}
  {/if}
</div>

<style>

</style>
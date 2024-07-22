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

  // reactive sort listener
  $: {
    if (sort && selectedSort) sort(selectedSort);
  }

  function onCategoryChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];
    let tempChecked = selectedCategories;

    if (e.target.checked) {
      if (!tempChecked.includes(name)){
        tempChecked.push(name);
      }
    }
    else {
      if (tempChecked.includes(name)) {
        let index = selectedCategories.indexOf(name);
        tempChecked.splice(index, 1);
      }
    }

    selectedCategories = tempChecked;
    if (refresh) refresh();
  }

  function onTopicChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];
    let tempChecked = selectedTopics;

    if (e.target.checked) {
      if (!tempChecked.includes(name)){
        tempChecked.push(name);
      }
    }
    else {
      if (tempChecked.includes(name)) {
        let index = selectedCategories.indexOf(name);
        tempChecked.splice(index, 1);
      }
    }

    selectedTopics = tempChecked;
    if (refresh) refresh();
  }

  function onTypeChange(e: any) {
    let name: string = e.target.attributes[1]["nodeValue"];
    let tempChecked = selectedTypes;

    if (e.target.checked) {
      if (!tempChecked.includes(name)){
        tempChecked.push(name);
      }
    }
    else {
      if (tempChecked.includes(name)) {
        let index = selectedCategories.indexOf(name);
        tempChecked.splice(index, 1);
      }
    }

    selectedTypes = tempChecked;
    if (refresh) refresh();
  }
</script>

<div class="filter_panel">
  <h4>Sort</h4>
  <div class="form_list">
    <div class="select_dropdown">
      <Select data={Object.values(SortTypes)} bind:selectedData={selectedSort} />
    </div>
  </div>

  <h4>Categories</h4>
  {#each categories as category}
    <div class="product_filter_checkbox">
      <input type="checkbox" id={category} name={category} on:change={onCategoryChange} /><label for={category}>{category}</label>
    </div>
  {/each}

  <h4>Topics</h4>
  {#each topics as topic}
    <div class="product_filter_checkbox">
      <input type="checkbox" id={topic} name={topic} on:change={onTopicChange} /><label for={topic}>{topic}</label>
    </div>
  {/each}

  <h4>Types</h4>
  {#each types as type}
    <div class="product_filter_checkbox">
      <input type="checkbox" id={type} name={type} on:change={onTypeChange} /><label for={type}>{type}</label>
    </div>
  {/each}
</div>

<style>
  .filter_panel {
    position: fixed;
    left: 24px;
    top: 60px;
    display: inline;
  }
</style>
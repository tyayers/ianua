<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import RowCard from "$lib/components.row.card.svelte";
  import Header from "$lib/components.header.svelte";
  import { DataConfig, RowConfig, UsageData } from "$lib/interfaces";
  import { appService } from "$lib/app-service";
  import Select from '$lib/components.select.svelte';
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  export let data: PageData;

  let sheetConfig: DataConfig | undefined = undefined;
  let tableData: {headers: string[], rows: RowConfig[]} = {
    headers: [],
    rows: []
  };
  let types: string[] = [ "All" ];
  let categories: string[] = [ "All" ];

  let searchText: string = "";
  let selectedCategory: string = "All";
  let selectedType: string = "All";

  $: {
    let tempSearchText = searchText;
    let tempSelectedCategory= selectedCategory;
    let tempSelectedType = selectedType;
    if (browser) refreshData();
  }

  onMount(() => {
    appService.LoadData(data.dataName).then((result) => {
      setData(result);
      refreshData();
    });

    fetch("/api/data/" + data.dataName + "/usage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        new UsageData("1", "EXPLORE", "VISIT", new Date().toString(), "")
      ),
    }).then((response) => {
      if (response.status != 200) {
        console.error("Could not update usage data - " + response.statusText);
      }
    });
  });

  function setData(newData: {headers: string[], rows: string[][]}) {
    if (!sheetConfig) sheetConfig = appService.GetSheetConfig(data.dataName, newData.headers);
    tableData.headers = newData.headers;

    newData.rows.forEach(row => {
      if (sheetConfig) {
        let newRow: RowConfig = appService.GetRowConfig(sheetConfig, newData.headers, row);
        tableData.rows.push(newRow);

        newRow.types.forEach(type => {
          if (!types.includes(type)) types.push(type);
        });

        newRow.categories.forEach(category => {
          if (!categories.includes(category)) categories.push(category);
        })
      }
    });

    types = types;
  }

  function refreshData() {
    tableData = tableData;
  }

  function checkRow(row: RowConfig): boolean {
    let result = true;
    if (
      (searchText &&
        !(
          row.name.toLowerCase().includes(searchText.toLowerCase()) ||
          row.description.toLowerCase().includes(searchText.toLowerCase())
        )) ||
      (selectedType && (selectedType != "All") && !row.types.includes(selectedType)) ||
      (selectedCategory && (selectedCategory != "All") && !row.categories.includes(selectedCategory))
    ) {
      result = false;
    }

    return result;
  }

  function actionAdd() {
    if (sheetConfig)
      goto("/" + sheetConfig.name + "/new");
  }
</script>

<Header actionButtonText="+ Add" actionEvent={actionAdd} showAlertButton={false} />

<div class="filter_bar">
  <div class="banner_search">
    <svg
      class="banner_search_icon"
      width="4%"
      height="100%"
      viewBox="0 0 18 18"
      preserveAspectRatio="xMidYMid meet"
      focusable="false"
      ><path
        d="M11.18 9.747l4.502 4.503-1.414 1.414-4.5-4.5a5 5 0 1 1 1.41-1.418zM7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        fill-rule="evenodd"
      ></path></svg
    >
    <input
      class="banner_search_input"
      bind:value={searchText}
      placeholder="Filter assets"
    />
  </div>
  <div class="select_dropdown" style="margin-left: 4px;">
    <Select data={types} bind:selectedData={selectedType} />
  </div>
  <div class="select_dropdown" style="margin-left: 4px;">
    <Select data={categories} bind:selectedData={selectedCategory} />
  </div>
</div>

{#if tableData.rows.length > 0}
  <div class="rows_box">
    {#each tableData.rows as row}
      {#if sheetConfig && checkRow(row)}
        <RowCard row={row} sheetConfig={sheetConfig} />
      {/if}
    {/each}
  </div>
{:else}
  <div
    class="ring_lower lds-ring"
    style="margin: auto; position: relative; top: 44px;"
  >
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
{/if}

<style>
  .filter_bar {
    position: absolute;
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: center;
    top: 0px;
    z-index: 3;
    position: sticky;
    top: 4px;
  }

  .banner_search {
    width: 30%;
    min-width: 180px;
    max-width: 800px;
    height: 44px;
    border-radius: 5px;
    background-color: #fafafa;
  }

  .banner_search_icon {
    margin-left: 9px;
  }

  .banner_search_input {
    width: 87%;
    margin-top: 4px;
    border-width: 0px;
    font-size: 14px;
    border: none;
    background-color: #fafafa;
    position: relative;
    top: -18px;
  }

  .banner_search_input:focus {
    outline: none;
  }

  .rows_box {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
    /* margin: 44px; */
    margin-top: 12px;
    margin-left: auto;
    margin-right: auto;
    /* padding-top: 14px; */
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
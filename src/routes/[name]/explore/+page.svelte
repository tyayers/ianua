<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import RowCard from "$lib/components.row.card.svelte";
  import Header from "$lib/components.header.svelte";
  import { DataConfig, RowConfig, UsageData } from "$lib/interfaces";
  import { appService } from "$lib/app-service";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  export let data: PageData;

  let sheetConfig: DataConfig | undefined = undefined;
  let tableData: {headers: string[], rows: RowConfig[]} = {
    headers: [],
    rows: []
  };

  let searchText: string = "";
  let selectedCategory: string = "";
  let selectedType: string = "";

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
      }
    });
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
      (selectedType && !row.types.includes(selectedType)) ||
      (selectedCategory && !row.categories.includes(selectedCategory))
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
  <input
    class="banner_search_input"
    bind:value={searchText}
    placeholder="Filter assets"
  />
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
    top: 0px;
    z-index: 3;
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
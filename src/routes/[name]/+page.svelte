<script lang="ts">
  import { onMount } from "svelte";
  import type { PageServerData } from "./$types";
  import RowCard from "$lib/components.row.card.svelte";
  import Header from "$lib/components.header.svelte";
  import { DataConfig, UsageData } from "$lib/interfaces";
  import { appService } from "$lib/app-service";
  import { goto } from "$app/navigation";

  export let data: PageServerData;

  class TagData {
    name: string;
    imageUrl: string;
    char: string;

    constructor(name: string, imageUrl: string, char: string) {
      this.name = name;
      this.imageUrl = imageUrl;
      this.char = char;
    }
  }

  let rowData: {headers: string[], rows: string[][]} = {headers: [], rows: []};
  let latestRows: string[][] = [];
  let highestRatedRows: string[][] = [];

  let searchText: string = "";
  let types: { [key: string]: TagData } = {};
  let categories: TagData[] = [];
  let categoriesOrdered: {[key: string]: TagData} = {};

  let selectedTypes: string[] = [];
  let selectedProducts: string[] = [];

  let sheetConfig: DataConfig | undefined = undefined;
  let nameIndex: number = -1;
  let descriptionIndex: number = -1;
  let typeIndex: number = -1;
  let categoryIndex: number = -1;
  let dateIndex: number = -1;
  let likesIndex: number = -1;

  let newRows: {date: string, alert: string}[] = [];

  $: {
    let tempSearchText = searchText;
    let tempSelectedTypes = selectedTypes;
    let tempSelectedProducts = selectedProducts;
    refreshData();
  }

  onMount(() => {
    if (data.userEmail) {
      let email: string = data.userEmail;
      if (email.includes(":")) email = email.split(":")[1];
      appService.LoadUser(email);
    }

    appService.LoadData(data.dataName).then((result) => {
      setData(result);
    });

    fetch("/api/data/" + data.dataName + "/usage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        new UsageData("1", "HOME", "VISIT", new Date().toString(), "")
      ),
    }).then((response) => {
      if (response.status != 200) {
        console.error("Could not update usage data - " + response.statusText);
      }
    });
  });

  function setData(newData: {headers: string[], rows: string[][]}) {
    rowData = newData;

    if (!sheetConfig) sheetConfig = appService.GetSheetConfig(data.dataName, rowData.headers);

    if (sheetConfig) {
      appService.SetHeaderAction("+ Add " + sheetConfig?.name);

      nameIndex = sheetConfig.tagIndexes["name"][0];
      descriptionIndex = sheetConfig.tagIndexes["description"][0];
      typeIndex = sheetConfig.tagIndexes["type"][0];
      categoryIndex = sheetConfig.tagIndexes["category"][0];
      dateIndex = sheetConfig.tagIndexes["date"][0];
      likesIndex = sheetConfig.tagIndexes["likes"][0];

      for (let row of rowData.rows) {

        let rowTypes: string[] = [];
        if (row[typeIndex]) rowTypes = row[typeIndex].split(",").map(function(item: string) {
          return item.trim();
        });

        for (let type of rowTypes) {
          if (! types[type]) {
            types[type] = {
              name: type,
              char: getTypeLetter(type),
              imageUrl: "/slides.svg",
            };
          }
        }

        let rowCategories: string[] = [];
        if (row[categoryIndex]) rowCategories = row[categoryIndex].split(",").map(function(item: string) {
          return item.trim();
        });

        for (let category of rowCategories) {
          if (!sheetConfig.categoryOrder.includes(category)) {
            const categoryIndex = categories.findIndex(item => item.name === category);
            if (categoryIndex === -1) {
            
              categories.push({
                name: category,
                char: getCategoryLetter(category),
                imageUrl: "/slides.svg",
              });
            }
          }
          else if (!categoriesOrdered[category]) {
            categoriesOrdered[category] = {
              name: category,
              char: getCategoryLetter(category),
              imageUrl: "/slides.svg",
            };
          }
        }

        newRows.push({
          date: row[sheetConfig.tagIndexes["date"][0]],
          alert: row[sheetConfig.tagIndexes["name"][0]]
        });
      }

      newRows = newRows;

      // Sort categories alphabetically
      categories.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });

      refreshData();
      types = types;
      categories = categories;
    }
  }

  function refreshData() {
    // Trigger general refresh
    rowData = rowData;
    
    // Calculate latest
    if (dateIndex) {
      rowData.rows.sort((a, b) => {
        let result = 0;
        let firstDate = new Date(a[dateIndex]);
        let secondDate = new Date(b[dateIndex]);
        if (firstDate < secondDate) result = 1;
        if (firstDate > secondDate) result = -1;

        return result;
      });
    }

    latestRows = [];
    for (let i = 0; i < rowData.rows.length; i++) {
      if (checkRow(rowData.rows[i])) {
        latestRows.push(rowData.rows[i]);
      }

      if (latestRows.length > 2) break;
    }
    latestRows = latestRows;

    // Calculate most liked
    let newHighestRatedRows = [];
    if (likesIndex) {
      rowData.rows.sort((a, b) => {
        let result = -1;
        let aLikesLength = 0, bLikesLength = 0;
        if (a[likesIndex].length > 0) aLikesLength = a[likesIndex].split(",").length;
        if (b[likesIndex].length > 0) bLikesLength = b[likesIndex].split(",").length;

        result = bLikesLength - aLikesLength;

        return result;
      });

      for (let i = 0; i < rowData.rows.length; i++) {
        if (checkRow(rowData.rows[i])) {
          newHighestRatedRows.push(rowData.rows[i]);
        }

        if (newHighestRatedRows.length > 5) break;
      }
    }
    highestRatedRows = newHighestRatedRows;

    // Sort main list alphabetically
    rowData.rows.sort(function(a, b) {
      var textA = a[nameIndex].toUpperCase();
      var textB = b[nameIndex].toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }

  function checkRow(row: string[]): boolean {
    let result = true;
    if (
      (searchText &&
        !(
          row[nameIndex].toLowerCase().includes(searchText.toLowerCase()) ||
          row[descriptionIndex].toLowerCase().includes(searchText.toLowerCase())
        )) ||
      (selectedTypes.length > 0 &&
        !selectedTypes.some((item) => row[typeIndex].includes(item))) ||
      (selectedProducts.length > 0 &&
        !selectedProducts.some((item) => row[categoryIndex].includes(item)))
    ) {
      result = false;
    }

    return result;
  }

  function getCategoryLetter(category: string): string {
    let result: string = category.toUpperCase().charAt(0);
    if (sheetConfig?.categoryAbbreviations[category])
      result = sheetConfig?.categoryAbbreviations[category];

    return result;
  }

  function getTypeLetter(type: string): string {
    let result: string = type.toUpperCase().charAt(0);
    if (sheetConfig?.typeAbbreviations[type])
      result = sheetConfig?.typeAbbreviations[type];

    return result;
  }

  function clickProduct(product: string) {
    if (selectedProducts.includes(product)) {
      // remove product
      let index = selectedProducts.indexOf(product);
      selectedProducts.splice(index, 1);
    } else {
      // add product
      selectedProducts.push(product);
    }
    selectedProducts = selectedProducts;
  }

  function clickType(type: string) {
    if (selectedTypes.includes(type)) {
      // remove product
      let index = selectedTypes.indexOf(type);
      selectedTypes.splice(index, 1);
    } else {
      // add product
      selectedTypes.push(type);
    }
    selectedTypes = selectedTypes;
  }

  function actionAdd() {
    if (sheetConfig)
      goto("/" + sheetConfig.name + "/new");
  }
</script>

<Header actionButtonText="+ Add" actionEvent={actionAdd} showAlertButton={true} alerts={newRows} />

<div class="home_box">
  <div class="hero_box">
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      src="/apigee-logo-colorful.png"
      width="78px"
      style="position: relative; top: 24px;"
    />
    Assets
  </div>

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
    <div class="banner_products_box">
      {#if sheetConfig && sheetConfig.categoryOrder}
        {#each sheetConfig.categoryOrder as category}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            on:click|stopPropagation={() => clickProduct(categoriesOrdered[category].name)}
            class="banner_product"
          >
            <div
              class={selectedProducts.includes(categoriesOrdered[category].name)
                ? "banner_product_icon banner_product_icon_selected"
                : "banner_product_icon"}
            >
              <!-- svelte-ignore a11y-missing-attribute -->
              <!-- <img width="24px" src={products[key].imageUrl} /> -->
              <span style="color: #3367d6; font-size: 22px; font-weight: bold;"
                >{categoriesOrdered[category].char}</span
              >
            </div>
            <div style="margin-top: 8px;">
              {categoriesOrdered[category].name}
            </div>
          </div>
        {/each}
      {/if}
      {#each categories as category}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          on:click|stopPropagation={() => clickProduct(category.name)}
          class="banner_product"
        >
          <div
            class={selectedProducts.includes(category.name)
              ? "banner_product_icon banner_product_icon_selected"
              : "banner_product_icon"}
          >
            <!-- svelte-ignore a11y-missing-attribute -->
            <!-- <img width="24px" src={products[key].imageUrl} /> -->
            <span style="color: #3367d6; font-size: 22px; font-weight: bold;"
              >{category.char}</span
            >
          </div>
          <div style="margin-top: 8px;">
            {category.name}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="types_box">
    {#each Object.keys(types) as key}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <span
        on:click|stopPropagation={() => clickType(key)}
        class={selectedTypes.includes(key)
          ? "type_chip type_chip_selected"
          : "type_chip"}
      >
        {#if selectedTypes.includes(key)}
          <span class="types_chip_icon" style="position: relative; top: -2px; left: 2px;">✓</span>
        {:else}
          <span class="types_chip_icon">{types[key].char}</span>
        {/if}
        <span style="float: right; margin-top: 2px;">{types[key].name}</span>
      </span>
    {/each}
  </div>

  {#if sheetConfig && rowData.rows.length > 0}
    <div
      style="max-width: 1000px; margin-left: auto; margin-right: auto; padding-left: 76px; margin-top: 28px; color: #3367d6;"
    >
      <span style="font-size: 24px;"
        >🖃 <span style="color: black">Latest</span></span
      >
    </div>

    <div class="assets_box">
      {#if latestRows.length > 0}
        {#each latestRows as row}
          {#if checkRow(row)}
            <RowCard row={row} sheetConfig={sheetConfig} />
          {/if}
        {/each}
      {/if}
    </div>

    <div
      style="max-width: 1000px; margin-left: auto; margin-right: auto; padding-left: 76px; margin-top: 28px; color: #3367d6;"
    >
      <span style="font-size: 24px;"
        >🖒 <span style="color: black">Highest rated</span></span
      >
    </div>

    <div class="assets_box">
      {#each highestRatedRows as highRow, i}
        <RowCard row={highRow} sheetConfig={sheetConfig} />
      {/each}
    </div>

    <div
      style="max-width: 1000px; margin-left: auto; margin-right: auto; padding-left: 76px; margin-top: 28px; color: #3367d6;"
    >
      <span style="font-size: 24px;"
        >🗁 <span style="color: black">All</span></span
      >
    </div>

    <div class="assets_box">
      {#each rowData.rows as row}
        {#if checkRow(row)}
          <RowCard row={row} sheetConfig={sheetConfig} />
        {/if}
      {/each}
    </div>
  {:else}
    <div
      class="ring_lower lds-ring"
      style="margin: auto; position: relative; top: -144px;"
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  {/if}
</div>

<div style="height: 44px"></div>

<style>
  .home_box {
    width: 100%;
    min-height: 100vh;
  }

  .hero_box {
    margin: auto;
    margin-top: 120px;
    margin-bottom: 24px;
    width: 400px;
    text-align: center;
    font-size: 44px;
  }

  .banner_search {
    width: 90%;
    margin: auto;
    max-width: 800px;
    height: 44px;
    margin-top: 38px;
    border-radius: 5px;
    background-color: #fafafa;
  }

  .banner_search_icon {
    margin-left: 9px;
  }

  .banner_search_input {
    width: 90%;
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

  .banner_products_box {
    margin-top: 8px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }

  .banner_product {
    text-align: center;
    max-width: 80px;
    margin: 0px 8px 0px 8px;
    color: gray;
    font-size: 14px;
  }

  .banner_product:hover {
    cursor: pointer;
  }

  .banner_product_icon {
    height: 32px;
    width: 40px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 8px;
    border-radius: 80%;
    border: transparent 1px solid;
  }

  .banner_product_icon_selected {
    background-color: #e4e4e4;
  }

  .banner_product_icon:hover {
    border: lightgray 1px solid;
    cursor: pointer;
  }

  .types_box {
    margin-top: 264px;
    /* margin-left: 58px; */
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-wrap: wrap;
    padding-left: 74px;
  }

  .type_chip {
    padding: 4px 8px 6px 8px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: bold;
    color: #3367d6;
    margin-right: 6px;
    margin-bottom: 4px;
    border-radius: 44px;
    height: 20px;
    border: lightgray 1px solid;
    /* background-color: #3367d6; */
  }

  .type_chip_selected {
    background-color: #d1e3ff;
  }

  .type_chip:hover {
    cursor: pointer;
    background-color: #d1e3ff;
  }

  .types_chip_icon {
    color: #3367d6;
    font-size: 16px;
    font-weight: bold;
    display: inline-block;
    width: 18px;
    margin-right: 6px;
  }

  .assets_box {
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

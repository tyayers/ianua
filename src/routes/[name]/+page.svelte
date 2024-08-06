<script lang="ts">
  import { onMount } from "svelte";
  import type { PageServerData } from "./$types";
  import RowCard from "$lib/components.row.card.svelte";
  import Header from "$lib/components.header.svelte";
  import { DataConfig, RowConfig, UsageData } from "$lib/interfaces";
  import { appService } from "$lib/app-service";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";

  export let data: PageServerData;

  class IconData {
    name: string;
    imageUrl: string;
    char: string;

    constructor(name: string, imageUrl: string, char: string) {
      this.name = name;
      this.imageUrl = imageUrl;
      this.char = char;
    }
  }

  let rowData: {headers: string[], rows: RowConfig[]} = {headers: [], rows: []} = {
    headers: [],
    rows: []
  };
  let latestRows: RowConfig[] = [];
  let highestRatedRows: RowConfig[] = [];

  let searchText: string = "";
  let typeIcons: { [key: string]: IconData } = {};
  let categoryIcons: IconData[] = [];
  let categoriesOrdered: {[key: string]: IconData} = {};

  let categories: string[] = [];
  let topics: string[] = [];
  let types: string[] = [];

  let selectedTypes: string[] = [];
  let selectedTopics: string[] = [];
  let selectedCategories: string[] = [];

  let sheetConfig: DataConfig | undefined = undefined;
  let nameIndex: number = -1;
  let descriptionIndex: number = -1;
  let typeIndex: number = -1;
  let categoryIndex: number = -1;
  let dateIndex: number = -1;
  let likesIndex: number = -1;

  let newRows: {date: string, alert: string, link: string}[] = [];

  $: {
    let tempSearchText = searchText;
    let tempSelectedTypes = selectedTypes;
    let tempSelectedProducts = selectedCategories;
    if (browser) refreshData();
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
    rowData.headers = newData.headers;
    if (!sheetConfig) sheetConfig = appService.GetSheetConfig(data.dataName, rowData.headers);

    if (sheetConfig && sheetConfig.tagIndexes && sheetConfig.tagIndexes["name"]) {
      appService.SetHeaderAction("+ Add");

      nameIndex = sheetConfig.tagIndexes["name"][0];
      descriptionIndex = sheetConfig.tagIndexes["description"][0];
      typeIndex = sheetConfig.tagIndexes["type"][0];
      categoryIndex = sheetConfig.tagIndexes["category"][0];
      dateIndex = sheetConfig.tagIndexes["date"][0];
      likesIndex = sheetConfig.tagIndexes["likes"][0];

      newData.rows.forEach(row => {

        if (sheetConfig) {
          let newRow = appService.GetRowConfig(sheetConfig, newData.headers, row);
          rowData.rows.push(newRow);

          for (let topic of newRow.topics) {
            if (!topics.includes(topic)) {
              topics.push(topic);
            }
          }

          for (let type of newRow.types) {
            if (! typeIcons[type]) {
              typeIcons[type] = {
                name: type,
                char: getTypeLetter(type),
                imageUrl: "/slides.svg",
              };

              types.push(type);
            }
          }

          for (let category of newRow.categories) {
            if (!categories.includes(category)) {
              categories.push(category);
              if (!sheetConfig.categoryOrder.includes(category)) {
                const categoryIndex = categoryIcons.findIndex(item => item.name === category);
                if (categoryIndex === -1) {
                
                  categoryIcons.push({
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
          }
        }
      });

      // Sort categories alphabetically
      categoryIcons.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });

      refreshData();
      typeIcons = typeIcons;
      categoryIcons = categoryIcons;
      categories = categories;
      topics = topics;
      types = types;
    }
    else {
      console.error("Sheet data was not loaded correctly.");
      console.log(sheetConfig);
    }
  }

  function refreshData() {
    // Trigger general refresh
    rowData = rowData;
    
    // Calculate latest
    if (dateIndex) {
      rowData.rows.sort((a, b) => {
        let result = 0;
        let firstDate = new Date(a.date);
        let secondDate = new Date(b.date);
        if (firstDate < secondDate) result = 1;
        if (firstDate > secondDate) result = -1;

        return result;
      });
    }


    let lastRead = localStorage.getItem(sheetConfig?.name + ".lastRead");
    latestRows = [];
    for (let i = 0; i < rowData.rows.length; i++) {
      if (lastRead && sheetConfig?.tagIndexes["date"]) {
        let rowDate = new Date(rowData.rows[i].date);
        let lastReadDate = new Date(lastRead);
        if (rowDate > lastReadDate) {
          newRows.push({date: rowData.rows[i].date, alert: rowData.rows[i].name, link: "/" + sheetConfig.name + "/" + rowData.rows[i].id});
        }
      } else if (sheetConfig) {
        newRows.push({date: rowData.rows[i].date, alert: rowData.rows[i].name, link: "/" + sheetConfig.name + "/" + rowData.rows[i].id});
      }

      if (checkRow(rowData.rows[i])) {
        if (latestRows.length <= 2)
          latestRows.push(rowData.rows[i]);
      }

      if (newRows.length > 19 || latestRows.length > 19) break;
    }
    latestRows = latestRows;
    newRows = newRows;

    // Calculate most liked
    highestRatedRows = [];
    if (likesIndex) {
      rowData.rows.sort((a, b) => {
        let result = -1;
        let aLikesLength = a.likes.length, bLikesLength = b.likes.length;
        result = bLikesLength - aLikesLength;

        return result;
      });

      for (let i = 0; i < rowData.rows.length; i++) {
        if (checkRow(rowData.rows[i])) {
          highestRatedRows.push(rowData.rows[i]);
        }

        if (highestRatedRows.length > 5) break;
      }
    }
    highestRatedRows = highestRatedRows;

    // Sort main list alphabetically
    rowData.rows.sort(function(a, b) {
      var textA = a.name.toUpperCase();
      var textB = b.name.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
  }

  function checkRow(row: RowConfig): boolean {
    let result = true;
    if (
      (searchText &&
        !(
          row.name.toLowerCase().includes(searchText.toLowerCase()) ||
          row.description.toLowerCase().includes(searchText.toLowerCase())
        )) ||
      (selectedTypes.length > 0 &&
        !selectedTypes.some((item) => row.types.includes(item))) ||
      (selectedCategories.length > 0 &&
        !selectedCategories.some((item) => row.categories.includes(item)))
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
    if (selectedCategories.includes(product)) {
      // remove product
      let index = selectedCategories.indexOf(product);
      selectedCategories.splice(index, 1);
    } else {
      // add product
      selectedCategories.push(product);
    }
    selectedCategories = selectedCategories;
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

  function alertsClick() {
    const nowDate = new Date();
    const nowDateString: string = (nowDate.getMonth() + 1).toString() + "/" + nowDate.getDate().toString() + "/" + nowDate.getFullYear().toString();

    localStorage.setItem(sheetConfig?.name + ".lastRead", nowDateString);
  }
</script>

<Header actionButtonText="+ Add" actionEvent={actionAdd} showAlertButton={true} alerts={newRows} {alertsClick} />

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

  {#if sheetConfig && sheetConfig.categoryOrder}
    <div class="banner_search_box">
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

    <div class="banner_categories">
      <div class="banner_products_box">
        {#each sheetConfig.categoryOrder as category}
          {#if categoriesOrdered[category]}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              on:click|stopPropagation={() => clickProduct(categoriesOrdered[category].name)}
              class="banner_product"
            >
              <div
                class={selectedCategories.includes(categoriesOrdered[category].name)
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
          {/if}
        {/each}
        {#each categoryIcons as category}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            on:click|stopPropagation={() => clickProduct(category.name)}
            class="banner_product"
          >
            <div
              class={selectedCategories.includes(category.name)
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
      {#each Object.keys(typeIcons) as key}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span
          on:click|stopPropagation={() => clickType(key)}
          class={selectedTypes.includes(key)
            ? "type_chip type_chip_selected"
            : "type_chip"}
        >
          {#if selectedTypes.includes(key)}
            <span class="types_chip_icon" style="position: relative; left: 2px;">✓</span>
          {:else}
            <span class="types_chip_icon">{typeIcons[key].char}</span>
          {/if}
          <span style="float: right; margin-top: 2px;">{typeIcons[key].name}</span>
        </span>
      {/each}
    </div>
  {/if}

  {#if sheetConfig && rowData.rows.length > 0}
    <div style="max-width: 1000px; margin-left: auto; margin-right: auto; padding-left: 76px; margin-top: 28px; color: #3367d6;">
      <a href={"/" + sheetConfig.name + "/explore?sort=Last+updated+descending"}>
        <span style="font-size: 24px;">🖃 <span style="color: black">Latest</span><span style="margin-left: 6px; font-size: 24px; position: relative; top: -3px;">↗</span></span>
      </a>
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
      <a href={"/" + sheetConfig.name + "/explore?sort=Likes+descending"}>
        <span style="font-size: 24px;"
          >🖒 <span style="color: black">Highest rated</span><span style="margin-left: 6px; font-size: 24px; position: relative; top: -3px;">↗</span></span
        >
      </a>
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
      style="margin: auto; position: relative; top: -2px;"
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

  .banner_categories {
    margin-top: 38px;
  }

  .banner_search_box {
    position: sticky;
    top: 4px;
    width: 90%;
    margin: auto;
    max-width: 800px;
    margin-bottom: 4px;
    z-index: 2;
    height: 44px;
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
    margin-top: 106px;
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

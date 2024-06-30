import { c as create_ssr_component, v as validate_component, d as add_attribute, f as each, e as escape, h as null_to_empty } from "../../../chunks/ssr.js";
import "../../../chunks/client.js";
import { C as Components_header } from "../../../chunks/components.header.js";
const css = {
  code: ".home_box.svelte-5zs0wz{width:100%;min-height:100vh}.hero_box.svelte-5zs0wz{margin:auto;margin-top:120px;margin-bottom:24px;width:400px;text-align:center;font-size:44px}.banner_search.svelte-5zs0wz{width:90%;margin:auto;max-width:800px;height:44px;margin-top:38px;border-radius:5px;background-color:#fafafa}.banner_search_icon.svelte-5zs0wz{margin-left:9px}.banner_search_input.svelte-5zs0wz{width:90%;margin-top:4px;border-width:0px;font-size:14px;border:none;background-color:#fafafa;position:relative;top:-18px}.banner_search_input.svelte-5zs0wz:focus{outline:none}.banner_products_box.svelte-5zs0wz{margin-top:8px;display:flex;flex-wrap:wrap;width:100%;justify-content:center}.banner_product.svelte-5zs0wz{text-align:center;max-width:80px;margin:0px 8px 0px 8px;color:gray;font-size:14px}.banner_product.svelte-5zs0wz:hover{cursor:pointer}.banner_product_icon.svelte-5zs0wz{height:32px;width:40px;margin-left:auto;margin-right:auto;padding-top:8px;border-radius:80%;border:transparent 1px solid}.banner_product_icon_selected.svelte-5zs0wz{background-color:#e4e4e4}.banner_product_icon.svelte-5zs0wz:hover{border:lightgray 1px solid;cursor:pointer}.types_box.svelte-5zs0wz{margin-top:264px;max-width:1000px;margin-left:auto;margin-right:auto;display:flex;flex-wrap:wrap;padding-left:74px}.type_chip.svelte-5zs0wz{padding:4px 8px 6px 8px;border-radius:24px;font-size:14px;font-weight:bold;color:#3367d6;margin-right:6px;margin-bottom:4px;border-radius:44px;height:20px;border:lightgray 1px solid}.type_chip_selected.svelte-5zs0wz{background-color:#d1e3ff}.type_chip.svelte-5zs0wz:hover{cursor:pointer;background-color:#d1e3ff}.types_chip_icon.svelte-5zs0wz{color:#3367d6;font-size:16px;font-weight:bold;display:inline-block;width:18px;margin-right:6px}.assets_box.svelte-5zs0wz{max-width:1000px;margin-left:auto;margin-right:auto;margin-top:12px;margin-left:auto;margin-right:auto;display:flex;flex-wrap:wrap;justify-content:center}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount } from \\"svelte\\";\\nimport RowCard from \\"$lib/components.row.card.svelte\\";\\nimport Header from \\"$lib/components.header.svelte\\";\\nimport { Config, DataConfig, UsageData } from \\"$lib/interfaces\\";\\nimport { PUBLIC_TEST_MODE } from \\"$env/static/public\\";\\nimport { appService } from \\"$lib/app-service\\";\\nimport { goto } from \\"$app/navigation\\";\\nexport let data;\\nclass TagData {\\n  name;\\n  imageUrl;\\n  char;\\n  constructor(name, imageUrl, char) {\\n    this.name = name;\\n    this.imageUrl = imageUrl;\\n    this.char = char;\\n  }\\n}\\nlet rowData = { headers: [], rows: [] };\\nlet latestRows = [];\\nlet highestRatedRows = [];\\nlet searchText = \\"\\";\\nlet types = {};\\nlet categories = [];\\nlet categoriesOrdered = {};\\nlet selectedTypes = [];\\nlet selectedProducts = [];\\nlet sheetConfig = void 0;\\nlet nameIndex = -1;\\nlet descriptionIndex = -1;\\nlet typeIndex = -1;\\nlet categoryIndex = -1;\\nlet dateIndex = -1;\\nlet likesIndex = -1;\\n$: {\\n  let tempSearchText = searchText;\\n  let tempSelectedTypes = selectedTypes;\\n  let tempSelectedProducts = selectedProducts;\\n  refreshData();\\n}\\nonMount(() => {\\n  if (data.userEmail) {\\n    let email = data.userEmail;\\n    if (email.includes(\\":\\"))\\n      email = email.split(\\":\\")[1];\\n    appService.LoadUser(email);\\n  }\\n  appService.LoadData(data.dataName).then((result) => {\\n    setData(result);\\n  });\\n  fetch(\\"/api/data/\\" + data.dataName + \\"/usage\\", {\\n    method: \\"POST\\",\\n    headers: {\\n      \\"Content-Type\\": \\"application/json\\"\\n    },\\n    body: JSON.stringify(\\n      new UsageData(\\"1\\", \\"HOME\\", \\"VISIT\\", (/* @__PURE__ */ new Date()).toString(), \\"\\")\\n    )\\n  }).then((response) => {\\n    if (response.status != 200) {\\n      console.error(\\"Could not update usage data - \\" + response.statusText);\\n    }\\n  });\\n});\\nfunction setData(newData) {\\n  rowData = newData;\\n  if (!sheetConfig)\\n    sheetConfig = appService.GetSheetConfig(data.dataName, rowData.headers);\\n  if (sheetConfig) {\\n    appService.SetHeaderAction(\\"+ Add \\" + sheetConfig?.name);\\n    nameIndex = sheetConfig.tagIndexes[\\"name\\"];\\n    descriptionIndex = sheetConfig.tagIndexes[\\"description\\"];\\n    typeIndex = sheetConfig.tagIndexes[\\"type\\"];\\n    categoryIndex = sheetConfig.tagIndexes[\\"category\\"];\\n    dateIndex = sheetConfig.tagIndexes[\\"date\\"];\\n    likesIndex = sheetConfig.tagIndexes[\\"likes\\"];\\n    for (let row of rowData.rows) {\\n      let rowTypes = [];\\n      if (row[typeIndex])\\n        rowTypes = row[typeIndex].split(\\",\\").map(function(item) {\\n          return item.trim();\\n        });\\n      for (let type of rowTypes) {\\n        if (!types[type]) {\\n          types[type] = {\\n            name: type,\\n            char: getTypeLetter(type),\\n            imageUrl: \\"/slides.svg\\"\\n          };\\n        }\\n      }\\n      let rowCategories = [];\\n      if (row[categoryIndex])\\n        rowCategories = row[categoryIndex].split(\\",\\").map(function(item) {\\n          return item.trim();\\n        });\\n      for (let category of rowCategories) {\\n        if (!sheetConfig.categoryOrder.includes(category)) {\\n          const categoryIndex2 = categories.findIndex((item) => item.name === category);\\n          if (categoryIndex2 === -1) {\\n            categories.push({\\n              name: category,\\n              char: getCategoryLetter(category),\\n              imageUrl: \\"/slides.svg\\"\\n            });\\n          }\\n        } else if (!categoriesOrdered[category]) {\\n          categoriesOrdered[category] = {\\n            name: category,\\n            char: getCategoryLetter(category),\\n            imageUrl: \\"/slides.svg\\"\\n          };\\n        }\\n      }\\n    }\\n    categories.sort(function(a, b) {\\n      var textA = a.name.toUpperCase();\\n      var textB = b.name.toUpperCase();\\n      return textA < textB ? -1 : textA > textB ? 1 : 0;\\n    });\\n    refreshData();\\n    types = types;\\n    categories = categories;\\n  }\\n}\\nfunction refreshData() {\\n  rowData = rowData;\\n  if (dateIndex) {\\n    rowData.rows.sort((a, b) => {\\n      let result = 0;\\n      let firstDate = new Date(a[dateIndex]);\\n      let secondDate = new Date(b[dateIndex]);\\n      if (firstDate < secondDate)\\n        result = 1;\\n      if (firstDate > secondDate)\\n        result = -1;\\n      return result;\\n    });\\n  }\\n  latestRows = [];\\n  for (let i = 0; i < rowData.rows.length; i++) {\\n    if (checkRow(rowData.rows[i])) {\\n      latestRows.push(rowData.rows[i]);\\n    }\\n    if (latestRows.length > 2)\\n      break;\\n  }\\n  latestRows = latestRows;\\n  let newHighestRatedAssets = [];\\n  if (likesIndex) {\\n    rowData.rows.sort((a, b) => {\\n      let result = -1;\\n      let aLikesLength = 0, bLikesLength = 0;\\n      if (a[likesIndex].length > 0)\\n        aLikesLength = a[likesIndex].split(\\",\\").length;\\n      if (b[likesIndex].length > 0)\\n        bLikesLength = b[likesIndex].split(\\",\\").length;\\n      result = bLikesLength - aLikesLength;\\n      return result;\\n    });\\n    for (let i = 0; i < rowData.rows.length; i++) {\\n      if (checkRow(rowData.rows[i])) {\\n        newHighestRatedAssets.push(rowData.rows[i]);\\n      }\\n      if (newHighestRatedAssets.length > 5)\\n        break;\\n    }\\n  }\\n  highestRatedRows = newHighestRatedAssets;\\n  rowData.rows.sort(function(a, b) {\\n    var textA = a[nameIndex].toUpperCase();\\n    var textB = b[nameIndex].toUpperCase();\\n    return textA < textB ? -1 : textA > textB ? 1 : 0;\\n  });\\n}\\nfunction checkRow(row) {\\n  let result = true;\\n  if (searchText && !(row[nameIndex].toLowerCase().includes(searchText.toLowerCase()) || row[descriptionIndex].toLowerCase().includes(searchText.toLowerCase())) || selectedTypes.length > 0 && !selectedTypes.some((item) => row[typeIndex].includes(item)) || selectedProducts.length > 0 && !selectedProducts.some((item) => row[categoryIndex].includes(item))) {\\n    result = false;\\n  }\\n  return result;\\n}\\nfunction getCategoryLetter(category) {\\n  let result = category.toUpperCase().charAt(0);\\n  if (sheetConfig?.categoryAbbreviations[category])\\n    result = sheetConfig?.categoryAbbreviations[category];\\n  return result;\\n}\\nfunction getTypeLetter(type) {\\n  let result = type.toUpperCase().charAt(0);\\n  if (sheetConfig?.typeAbbreviations[type])\\n    result = sheetConfig?.typeAbbreviations[type];\\n  return result;\\n}\\nfunction clickProduct(product) {\\n  if (selectedProducts.includes(product)) {\\n    let index = selectedProducts.indexOf(product);\\n    selectedProducts.splice(index, 1);\\n  } else {\\n    selectedProducts.push(product);\\n  }\\n  selectedProducts = selectedProducts;\\n}\\nfunction clickType(type) {\\n  if (selectedTypes.includes(type)) {\\n    let index = selectedTypes.indexOf(type);\\n    selectedTypes.splice(index, 1);\\n  } else {\\n    selectedTypes.push(type);\\n  }\\n  selectedTypes = selectedTypes;\\n}\\nfunction actionAdd() {\\n  if (sheetConfig)\\n    goto(\\"/\\" + sheetConfig.name + \\"/new\\");\\n}\\n<\/script>\\n\\n<Header actionButtonText=\\"+ Add\\" actionEvent={actionAdd} />\\n\\n<div class=\\"home_box\\">\\n  <div class=\\"hero_box\\">\\n    <!-- svelte-ignore a11y-missing-attribute -->\\n    <img\\n      src=\\"/apigee-logo-colorful.png\\"\\n      width=\\"78px\\"\\n      style=\\"position: relative; top: 24px;\\"\\n    />\\n    Assets\\n  </div>\\n\\n  <div class=\\"banner_search\\">\\n    <svg\\n      class=\\"banner_search_icon\\"\\n      width=\\"4%\\"\\n      height=\\"100%\\"\\n      viewBox=\\"0 0 18 18\\"\\n      preserveAspectRatio=\\"xMidYMid meet\\"\\n      focusable=\\"false\\"\\n      ><path\\n        d=\\"M11.18 9.747l4.502 4.503-1.414 1.414-4.5-4.5a5 5 0 1 1 1.41-1.418zM7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z\\"\\n        fill-rule=\\"evenodd\\"\\n      ></path></svg\\n    >\\n    <input\\n      class=\\"banner_search_input\\"\\n      bind:value={searchText}\\n      placeholder=\\"Filter assets\\"\\n    />\\n    <div class=\\"banner_products_box\\">\\n      {#if sheetConfig && sheetConfig.categoryOrder}\\n        {#each sheetConfig.categoryOrder as category}\\n          <!-- svelte-ignore a11y-click-events-have-key-events -->\\n          <!-- svelte-ignore a11y-no-static-element-interactions -->\\n          <div\\n            on:click|stopPropagation={() => clickProduct(categoriesOrdered[category].name)}\\n            class=\\"banner_product\\"\\n          >\\n            <div\\n              class={selectedProducts.includes(categoriesOrdered[category].name)\\n                ? \\"banner_product_icon banner_product_icon_selected\\"\\n                : \\"banner_product_icon\\"}\\n            >\\n              <!-- svelte-ignore a11y-missing-attribute -->\\n              <!-- <img width=\\"24px\\" src={products[key].imageUrl} /> -->\\n              <span style=\\"color: #3367d6; font-size: 22px; font-weight: bold;\\"\\n                >{categoriesOrdered[category].char}</span\\n              >\\n            </div>\\n            <div style=\\"margin-top: 8px;\\">\\n              {categoriesOrdered[category].name}\\n            </div>\\n          </div>\\n        {/each}\\n      {/if}\\n      {#each categories as category}\\n        <!-- svelte-ignore a11y-click-events-have-key-events -->\\n        <!-- svelte-ignore a11y-no-static-element-interactions -->\\n        <div\\n          on:click|stopPropagation={() => clickProduct(category.name)}\\n          class=\\"banner_product\\"\\n        >\\n          <div\\n            class={selectedProducts.includes(category.name)\\n              ? \\"banner_product_icon banner_product_icon_selected\\"\\n              : \\"banner_product_icon\\"}\\n          >\\n            <!-- svelte-ignore a11y-missing-attribute -->\\n            <!-- <img width=\\"24px\\" src={products[key].imageUrl} /> -->\\n            <span style=\\"color: #3367d6; font-size: 22px; font-weight: bold;\\"\\n              >{category.char}</span\\n            >\\n          </div>\\n          <div style=\\"margin-top: 8px;\\">\\n            {category.name}\\n          </div>\\n        </div>\\n      {/each}\\n    </div>\\n  </div>\\n\\n  <div class=\\"types_box\\">\\n    {#each Object.keys(types) as key}\\n      <!-- svelte-ignore a11y-click-events-have-key-events -->\\n      <!-- svelte-ignore a11y-no-static-element-interactions -->\\n      <span\\n        on:click|stopPropagation={() => clickType(key)}\\n        class={selectedTypes.includes(key)\\n          ? \\"type_chip type_chip_selected\\"\\n          : \\"type_chip\\"}\\n      >\\n        {#if selectedTypes.includes(key)}\\n          <span class=\\"types_chip_icon\\" style=\\"position: relative; top: -2px; left: 2px;\\">✓</span>\\n        {:else}\\n          <span class=\\"types_chip_icon\\">{types[key].char}</span>\\n        {/if}\\n        <span style=\\"float: right; margin-top: 2px;\\">{types[key].name}</span>\\n      </span>\\n    {/each}\\n  </div>\\n\\n  {#if sheetConfig && rowData.rows.length > 0}\\n    <div\\n      style=\\"max-width: 1000px; margin-left: auto; margin-right: auto; padding-left: 76px; margin-top: 28px; color: #3367d6;\\"\\n    >\\n      <span style=\\"font-size: 24px;\\"\\n        >🖃 <span style=\\"color: black\\">Latest</span></span\\n      >\\n    </div>\\n\\n    <div class=\\"assets_box\\">\\n      {#if latestRows.length > 0}\\n        {#each latestRows as row}\\n          {#if checkRow(row)}\\n            <RowCard row={row} sheetConfig={sheetConfig} />\\n          {/if}\\n        {/each}\\n      {/if}\\n    </div>\\n\\n    <div\\n      style=\\"max-width: 1000px; margin-left: auto; margin-right: auto; padding-left: 76px; margin-top: 28px; color: #3367d6;\\"\\n    >\\n      <span style=\\"font-size: 24px;\\"\\n        >🖒 <span style=\\"color: black\\">Highest rated</span></span\\n      >\\n    </div>\\n\\n    <div class=\\"assets_box\\">\\n      {#each highestRatedRows as highRow, i}\\n        <RowCard row={highRow} sheetConfig={sheetConfig} />\\n      {/each}\\n    </div>\\n\\n    <div\\n      style=\\"max-width: 1000px; margin-left: auto; margin-right: auto; padding-left: 76px; margin-top: 28px; color: #3367d6;\\"\\n    >\\n      <span style=\\"font-size: 24px;\\"\\n        >🗁 <span style=\\"color: black\\">All</span></span\\n      >\\n    </div>\\n\\n    <div class=\\"assets_box\\">\\n      {#each rowData.rows as row}\\n        {#if checkRow(row)}\\n          <RowCard row={row} sheetConfig={sheetConfig} />\\n        {/if}\\n      {/each}\\n    </div>\\n  {:else}\\n    <div\\n      class=\\"ring_lower lds-ring\\"\\n      style=\\"margin: auto; position: relative; top: -144px;\\"\\n    >\\n      <div></div>\\n      <div></div>\\n      <div></div>\\n      <div></div>\\n    </div>\\n  {/if}\\n</div>\\n\\n<div style=\\"height: 44px\\"></div>\\n\\n<style>\\n  .home_box {\\n    width: 100%;\\n    min-height: 100vh;\\n  }\\n\\n  .hero_box {\\n    margin: auto;\\n    margin-top: 120px;\\n    margin-bottom: 24px;\\n    width: 400px;\\n    text-align: center;\\n    font-size: 44px;\\n  }\\n\\n  .banner_search {\\n    width: 90%;\\n    margin: auto;\\n    max-width: 800px;\\n    height: 44px;\\n    margin-top: 38px;\\n    border-radius: 5px;\\n    background-color: #fafafa;\\n  }\\n\\n  .banner_search_icon {\\n    margin-left: 9px;\\n  }\\n\\n  .banner_search_input {\\n    width: 90%;\\n    margin-top: 4px;\\n    border-width: 0px;\\n    font-size: 14px;\\n    border: none;\\n    background-color: #fafafa;\\n    position: relative;\\n    top: -18px;\\n  }\\n\\n  .banner_search_input:focus {\\n    outline: none;\\n  }\\n\\n  .banner_products_box {\\n    margin-top: 8px;\\n    display: flex;\\n    flex-wrap: wrap;\\n    width: 100%;\\n    justify-content: center;\\n  }\\n\\n  .banner_product {\\n    text-align: center;\\n    max-width: 80px;\\n    margin: 0px 8px 0px 8px;\\n    color: gray;\\n    font-size: 14px;\\n  }\\n\\n  .banner_product:hover {\\n    cursor: pointer;\\n  }\\n\\n  .banner_product_icon {\\n    height: 32px;\\n    width: 40px;\\n    margin-left: auto;\\n    margin-right: auto;\\n    padding-top: 8px;\\n    border-radius: 80%;\\n    border: transparent 1px solid;\\n  }\\n\\n  .banner_product_icon_selected {\\n    background-color: #e4e4e4;\\n  }\\n\\n  .banner_product_icon:hover {\\n    border: lightgray 1px solid;\\n    cursor: pointer;\\n  }\\n\\n  .types_box {\\n    margin-top: 264px;\\n    /* margin-left: 58px; */\\n    max-width: 1000px;\\n    margin-left: auto;\\n    margin-right: auto;\\n    display: flex;\\n    flex-wrap: wrap;\\n    padding-left: 74px;\\n  }\\n\\n  .type_chip {\\n    padding: 4px 8px 6px 8px;\\n    border-radius: 24px;\\n    font-size: 14px;\\n    font-weight: bold;\\n    color: #3367d6;\\n    margin-right: 6px;\\n    margin-bottom: 4px;\\n    border-radius: 44px;\\n    height: 20px;\\n    border: lightgray 1px solid;\\n    /* background-color: #3367d6; */\\n  }\\n\\n  .type_chip_selected {\\n    background-color: #d1e3ff;\\n  }\\n\\n  .type_chip:hover {\\n    cursor: pointer;\\n    background-color: #d1e3ff;\\n  }\\n\\n  .types_chip_icon {\\n    color: #3367d6;\\n    font-size: 16px;\\n    font-weight: bold;\\n    display: inline-block;\\n    width: 18px;\\n    margin-right: 6px;\\n  }\\n\\n  .assets_box {\\n    max-width: 1000px;\\n    margin-left: auto;\\n    margin-right: auto;\\n    /* margin: 44px; */\\n    margin-top: 12px;\\n    margin-left: auto;\\n    margin-right: auto;\\n    /* padding-top: 14px; */\\n    display: flex;\\n    flex-wrap: wrap;\\n    justify-content: center;\\n  }\\n</style>\\n"],"names":[],"mappings":"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"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let rowData = { headers: [], rows: [] };
  let latestRows = [];
  let searchText = "";
  let types = {};
  let categories = [];
  let selectedTypes = [];
  let selectedProducts = [];
  let nameIndex = -1;
  let typeIndex = -1;
  let categoryIndex = -1;
  let dateIndex = -1;
  let likesIndex = -1;
  function refreshData() {
    rowData = rowData;
    {
      rowData.rows.sort((a, b) => {
        let result = 0;
        let firstDate = new Date(a[dateIndex]);
        let secondDate = new Date(b[dateIndex]);
        if (firstDate < secondDate)
          result = 1;
        if (firstDate > secondDate)
          result = -1;
        return result;
      });
    }
    latestRows = [];
    for (let i = 0; i < rowData.rows.length; i++) {
      if (checkRow(rowData.rows[i])) {
        latestRows.push(rowData.rows[i]);
      }
      if (latestRows.length > 2)
        break;
    }
    latestRows = latestRows;
    let newHighestRatedAssets = [];
    {
      rowData.rows.sort((a, b) => {
        let result = -1;
        let aLikesLength = 0, bLikesLength = 0;
        if (a[likesIndex].length > 0)
          aLikesLength = a[likesIndex].split(",").length;
        if (b[likesIndex].length > 0)
          bLikesLength = b[likesIndex].split(",").length;
        result = bLikesLength - aLikesLength;
        return result;
      });
      for (let i = 0; i < rowData.rows.length; i++) {
        if (checkRow(rowData.rows[i])) {
          newHighestRatedAssets.push(rowData.rows[i]);
        }
        if (newHighestRatedAssets.length > 5)
          break;
      }
    }
    rowData.rows.sort(function(a, b) {
      var textA = a[nameIndex].toUpperCase();
      var textB = b[nameIndex].toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }
  function checkRow(row) {
    let result = true;
    if (selectedTypes.length > 0 && !selectedTypes.some((item) => row[typeIndex].includes(item)) || selectedProducts.length > 0 && !selectedProducts.some((item) => row[categoryIndex].includes(item))) {
      result = false;
    }
    return result;
  }
  function actionAdd() {
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  {
    {
      refreshData();
    }
  }
  return `${validate_component(Components_header, "Header").$$render(
    $$result,
    {
      actionButtonText: "+ Add",
      actionEvent: actionAdd
    },
    {},
    {}
  )} <div class="home_box svelte-5zs0wz"><div class="hero_box svelte-5zs0wz" data-svelte-h="svelte-tdlazy"> <img src="/apigee-logo-colorful.png" width="78px" style="position: relative; top: 24px;">
    Assets</div> <div class="banner_search svelte-5zs0wz"><svg class="banner_search_icon svelte-5zs0wz" width="4%" height="100%" viewBox="0 0 18 18" preserveAspectRatio="xMidYMid meet" focusable="false"><path d="M11.18 9.747l4.502 4.503-1.414 1.414-4.5-4.5a5 5 0 1 1 1.41-1.418zM7 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill-rule="evenodd"></path></svg> <input class="banner_search_input svelte-5zs0wz" placeholder="Filter assets"${add_attribute("value", searchText, 0)}> <div class="banner_products_box svelte-5zs0wz">${``} ${each(categories, (category) => {
    return `  <div class="banner_product svelte-5zs0wz"><div class="${escape(
      null_to_empty(selectedProducts.includes(category.name) ? "banner_product_icon banner_product_icon_selected" : "banner_product_icon"),
      true
    ) + " svelte-5zs0wz"}">  <span style="color: #3367d6; font-size: 22px; font-weight: bold;">${escape(category.char)}</span></div> <div style="margin-top: 8px;">${escape(category.name)}</div> </div>`;
  })}</div></div> <div class="types_box svelte-5zs0wz">${each(Object.keys(types), (key) => {
    return `  <span class="${escape(
      null_to_empty(selectedTypes.includes(key) ? "type_chip type_chip_selected" : "type_chip"),
      true
    ) + " svelte-5zs0wz"}">${selectedTypes.includes(key) ? `<span class="types_chip_icon svelte-5zs0wz" style="position: relative; top: -2px; left: 2px;" data-svelte-h="svelte-k89s3t">✓</span>` : `<span class="types_chip_icon svelte-5zs0wz">${escape(types[key].char)}</span>`} <span style="float: right; margin-top: 2px;">${escape(types[key].name)}</span> </span>`;
  })}</div> ${`<div class="ring_lower lds-ring" style="margin: auto; position: relative; top: -144px;" data-svelte-h="svelte-hmouxj"><div></div> <div></div> <div></div> <div></div></div>`}</div> <div style="height: 44px"></div>`;
});
export {
  Page as default
};

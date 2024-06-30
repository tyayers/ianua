import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/client.js";
import { C as Components_header } from "../../../../../chunks/components.header.js";
/* empty css                                                                    */
const css = {
  code: ".new_box.svelte-eoyr66{max-width:600px;margin-left:auto;margin-right:auto}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { goto } from \\"$app/navigation\\";\\nimport { Asset, AssetStatus, DataConfig, RowConfig } from \\"$lib/interfaces\\";\\nimport Header from \\"$lib/components.header.svelte\\";\\nimport RowEdit from \\"$lib/components.row.edit.svelte\\";\\nimport { appService } from \\"$lib/app-service\\";\\nimport { onMount } from \\"svelte\\";\\nexport let data;\\nlet sheetConfig = void 0;\\nlet rowConfig = void 0;\\nlet row = [];\\nlet headers = [];\\nlet idIndex = -1;\\nonMount(() => {\\n  document.title = \\"Loading...\\";\\n  appService.LoadData(data.dataName).then((result) => {\\n    headers = result.headers;\\n    sheetConfig = appService.GetSheetConfig(data.dataName, headers);\\n    if (sheetConfig) {\\n      idIndex = sheetConfig?.tagIndexes[\\"id\\"];\\n      let tempRow = result.rows.find((item) => item[idIndex] === data.rowId);\\n      if (tempRow) {\\n        row = tempRow;\\n        rowConfig = appService.GetRowConfig(sheetConfig, result.headers, row);\\n        document.title = rowConfig.name;\\n      }\\n    }\\n  });\\n});\\nfunction back() {\\n  history.back();\\n}\\nfunction submit() {\\n  fetch(\\"/api/data/\\" + sheetConfig?.name + \\"/\\" + row[idIndex] + \\"?rangeStart=\\" + sheetConfig?.rangeStart, {\\n    method: \\"PUT\\",\\n    headers: {\\n      \\"Content-Type\\": \\"application/json\\"\\n    },\\n    body: JSON.stringify(row)\\n  }).then((response) => {\\n    return response.json();\\n  }).then((result) => {\\n    history.back();\\n  });\\n}\\n<\/script>\\n\\n<Header actionButtonText=\\"Save\\" actionButtonColor=\\"green\\" actionButtonTextColor=\\"white\\" actionEvent={submit} /> \\n\\n<div class=\\"new_box\\">\\n\\n  <div class=\\"back_box\\">\\n    <button style=\\"position: relative; top: 12px; left: -12px;\\" class=\\"back_button\\" on:click={back}><svg data-icon-name=\\"arrowBackIcon\\" viewBox=\\"0 0 24 24\\" width=\\"24\\" height=\\"24\\" aria-hidden=\\"true\\"><path fill-rule=\\"evenodd\\" d=\\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z\\"></path></svg></button>\\n  </div>\\n\\n  {#if sheetConfig && rowConfig}\\n    <RowEdit {sheetConfig} {rowConfig} />\\n\\n    <div class=\\"form_controls\\" style=\\"margin-top: 44px;\\">\\n      <button on:click={back} type=\\"button\\" class=\\"rounded_button_outlined\\">Cancel</button>\\n      <button type=\\"button\\" on:click={submit} class=\\"rounded_button_filled\\">Save</button>\\n    </div>\\n  {/if}\\n</div>\\n\\n<style>\\n  .new_box {\\n    max-width: 600px;\\n    /* padding-left: 44px; */\\n    margin-left: auto;\\n    margin-right: auto;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAiEE,sBAAS,CACP,SAAS,CAAE,KAAK,CAEhB,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAChB"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let sheetConfig = void 0;
  let row = [];
  let idIndex = -1;
  function submit() {
    fetch("/api/data/" + sheetConfig?.name + "/" + row[idIndex] + "?rangeStart=" + sheetConfig?.rangeStart, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row)
    }).then((response) => {
      return response.json();
    }).then((result) => {
      history.back();
    });
  }
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `${validate_component(Components_header, "Header").$$render(
    $$result,
    {
      actionButtonText: "Save",
      actionButtonColor: "green",
      actionButtonTextColor: "white",
      actionEvent: submit
    },
    {},
    {}
  )} <div class="new_box svelte-eoyr66"><div class="back_box"><button style="position: relative; top: 12px; left: -12px;" class="back_button" data-svelte-h="svelte-1sf4hnw"><svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg></button></div> ${``} </div>`;
});
export {
  Page as default
};

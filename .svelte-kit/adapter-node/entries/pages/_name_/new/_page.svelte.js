import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { g as goto } from "../../../../chunks/client.js";
import { a as appService, C as Components_header, R as RowConfig } from "../../../../chunks/components.header.js";
/* empty css                                                                 */
const css = {
  code: ".new_box.svelte-eoyr66{max-width:600px;margin-left:auto;margin-right:auto}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { goto } from \\"$app/navigation\\";\\nimport { DataConfig, RowConfig } from \\"$lib/interfaces\\";\\nimport RowEdit from \\"$lib/components.row.edit.svelte\\";\\nimport Header from \\"$lib/components.header.svelte\\";\\nimport { appService } from \\"$lib/app-service\\";\\nimport { onMount } from \\"svelte\\";\\nexport let data;\\nlet sheetConfig = void 0;\\nlet rowConfig = new RowConfig();\\nlet headers = [];\\nlet idIndex = -1;\\nonMount(() => {\\n  appService.LoadData(data.dataName).then((result) => {\\n    headers = result.headers;\\n    sheetConfig = appService.GetSheetConfig(data.dataName, headers);\\n    if (sheetConfig) {\\n      appService.setHeaderAction(\\"SAVE\\");\\n      idIndex = sheetConfig?.tagIndexes[\\"id\\"][0];\\n      rowConfig = appService.GetRowConfig(sheetConfig, result.headers);\\n    }\\n  });\\n  document.addEventListener(\\"headerAction\\", () => {\\n    submit();\\n  });\\n});\\nfunction back() {\\n  history.back();\\n}\\nfunction submit() {\\n  fetch(\\"/api/data/\\" + sheetConfig?.name, {\\n    method: \\"POST\\",\\n    headers: {\\n      \\"Content-Type\\": \\"application/json\\"\\n    },\\n    body: JSON.stringify(rowConfig.row)\\n  }).then((response) => {\\n    if (response.status === 200)\\n      return response.json();\\n    else\\n      console.error(\\"Error creating row: \\" + response.statusText);\\n  }).then((result) => {\\n    if (result && sheetConfig) {\\n      result.push(appService.data[sheetConfig.name].rows.length.toString());\\n      appService.data[sheetConfig.name].rows.push(result);\\n    }\\n    goto(`/${sheetConfig?.name}`);\\n  });\\n}\\n<\/script>\\n\\n<Header actionButtonText=\\"Save\\" actionButtonColor=\\"green\\" actionButtonTextColor=\\"white\\" actionEvent={submit} /> \\n\\n<div class=\\"new_box\\">\\n\\n  <div class=\\"back_box\\">\\n    <button style=\\"position: relative; top: 12px; left: -12px;\\" class=\\"back_button\\" on:click={back}><svg data-icon-name=\\"arrowBackIcon\\" viewBox=\\"0 0 24 24\\" width=\\"24\\" height=\\"24\\" aria-hidden=\\"true\\"><path fill-rule=\\"evenodd\\" d=\\"M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z\\"></path></svg></button>\\n  </div>\\n\\n  {#if sheetConfig && rowConfig}\\n    <div style=\\"padding-bottom: 104px;\\">\\n      <RowEdit {sheetConfig} {rowConfig} />\\n    </div>\\n\\n    <!-- <div class=\\"form_controls\\" style=\\"margin-top: 44px;\\">\\n      <button on:click={back} type=\\"button\\" class=\\"rounded_button_outlined\\">Cancel</button>\\n      <button type=\\"button\\" on:click={submit} class=\\"rounded_button_filled\\">Save</button>\\n    </div> -->\\n  {:else}\\n    <div\\n      class=\\"ring_lower lds-ring\\"\\n      style=\\"margin: auto; position: relative; top: 64px;\\"\\n    >\\n      <div></div>\\n      <div></div>\\n      <div></div>\\n      <div></div>\\n    </div>\\n  {/if}\\n</div>\\n\\n<style>\\n  .new_box {\\n    max-width: 600px;\\n    /* padding-left: 44px; */\\n    margin-left: auto;\\n    margin-right: auto;\\n  }\\n</style>\\n"],"names":[],"mappings":"AAiFE,sBAAS,CACP,SAAS,CAAE,KAAK,CAEhB,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,IAChB"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let sheetConfig = void 0;
  let rowConfig = new RowConfig();
  function submit() {
    fetch("/api/data/" + sheetConfig?.name, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rowConfig.row)
    }).then((response) => {
      if (response.status === 200)
        return response.json();
      else
        console.error("Error creating row: " + response.statusText);
    }).then((result) => {
      if (result && sheetConfig) {
        result.push(appService.data[sheetConfig.name].rows.length.toString());
        appService.data[sheetConfig.name].rows.push(result);
      }
      goto();
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
  )} <div class="new_box svelte-eoyr66"><div class="back_box"><button style="position: relative; top: 12px; left: -12px;" class="back_button" data-svelte-h="svelte-1sf4hnw"><svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg></button></div> ${`<div class="ring_lower lds-ring" style="margin: auto; position: relative; top: 64px;" data-svelte-h="svelte-1t4d9sj"><div></div> <div></div> <div></div> <div></div></div>`} </div>`;
});
export {
  Page as default
};

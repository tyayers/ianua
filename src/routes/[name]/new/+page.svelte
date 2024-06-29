<script lang="ts">
  import { goto } from "$app/navigation";
  import { DataConfig, RowConfig } from "$lib/interfaces";
  import RowEdit from '$lib/components.row.edit.svelte';
  import Header from '$lib/components.header.svelte';

  import { appService } from "$lib/app-service";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;
  let sheetConfig: DataConfig | undefined = undefined;
  let rowConfig: RowConfig = new RowConfig();
  let headers: string[] = [];
  let idIndex: number = -1;

  onMount(() => {
    appService.LoadData(data.dataName).then((result) => {
      headers = result.headers;
      sheetConfig = appService.GetSheetConfig(data.dataName, headers);
      if (sheetConfig) {
        appService.setHeaderAction("SAVE");
        idIndex = sheetConfig?.tagIndexes["id"];
        rowConfig = appService.GetRowConfig(sheetConfig, result.headers);
      }
    });

    document.addEventListener("headerAction", () => {
      submit();
    });
  });

  function back() {
    history.back();
  }

  function submit() {
    fetch("/api/data/" + sheetConfig?.name, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rowConfig.row)
    }).then((response) => {
      // console.log(`Response ${response.status} - ${response.statusText} from asset post.`);
      if (response.status === 200)
        return response.json();
      else
        console.error("Error creating row: " + response.statusText);
    }).then((result: string[]) => {
      if (result && sheetConfig) {
        result.push((appService.data[sheetConfig.name].rows.length).toString());
        appService.data[sheetConfig.name].rows.push(result);
      }
      goto(`/${sheetConfig?.name}`);
    });
  }

</script>

<Header actionButtonText="Save" actionButtonColor="green" actionButtonTextColor="white" actionEvent={submit} /> 

<div class="new_box">

  <div class="back_box">
    <button style="position: relative; top: 12px; left: -12px;" class="back_button" on:click={back}><svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg></button>
  </div>

  {#if sheetConfig && rowConfig}
    <div style="padding-bottom: 104px;">
      <RowEdit {sheetConfig} {rowConfig} />
    </div>

    <!-- <div class="form_controls" style="margin-top: 44px;">
      <button on:click={back} type="button" class="rounded_button_outlined">Cancel</button>
      <button type="button" on:click={submit} class="rounded_button_filled">Save</button>
    </div> -->
  {:else}
    <div
      class="ring_lower lds-ring"
      style="margin: auto; position: relative; top: 64px;"
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  {/if}
</div>

<style>
  .new_box {
    max-width: 600px;
    /* padding-left: 44px; */
    margin-left: auto;
    margin-right: auto;
  }
</style>

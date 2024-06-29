<script lang="ts">
  import TagCloud from '$lib/components.tag.cloud.svelte';
  import { appService } from "$lib/app-service";
  import Select from "$lib/components.select.svelte";
  import { Config, DataConfig, RowConfig } from './interfaces';
  import { onMount } from 'svelte';

  export let sheetConfig: DataConfig;
  export let rowConfig: RowConfig;

</script>

<div style="margin-top: 40px">
  {#if sheetConfig}
    {#each sheetConfig.fields as field, i}
      {#if !field.visability || field.visability.toLowerCase() != "hidden"}
        {#if field.type === "string"}
          <div class="input_field_panel">
            {#if field.autofocus}
              <!-- svelte-ignore a11y-autofocus -->
              <input class="input_field" type="text" name={field.id} id={field.id} required bind:value={rowConfig.row[sheetConfig.fieldIndexes[field.id]]} autocomplete="off" autofocus title="Name" />
            {:else}
              <input class="input_field" type="text" name={field.id} id={field.id} required bind:value={rowConfig.row[sheetConfig.fieldIndexes[field.id]]} autocomplete="off" title="Name" />
            {/if}
            <label for={field.id} class='input_field_placeholder'>
              {field.id}
            </label>
          </div>
        {:else if field.type === "longString"}
          <div class="input_field_panel">
            <!-- svelte-ignore a11y-autofocus -->
            <textarea name={field.id} id={field.id} required class="input_field" bind:value={rowConfig.row[sheetConfig.fieldIndexes[field.id]]} rows="5"></textarea>
            <label for={field.id} class='input_field_placeholder'>
              {field.id}
            </label>
          </div>
        {:else if field.type === "date"}
          <div class="input_field_panel">
            <!-- svelte-ignore a11y-autofocus -->
            {#if field.autofocus}
              <!-- svelte-ignore a11y-autofocus -->
              <input class="input_field" type="text" name={field.id} id={field.id} required bind:value={rowConfig.row[sheetConfig.fieldIndexes[field.id]]} autocomplete="off" autofocus title="Name" />
            {:else}
              <input class="input_field" type="text" name={field.id} id={field.id} required bind:value={rowConfig.row[sheetConfig.fieldIndexes[field.id]]} autocomplete="off" title="Name" />
            {/if}            <label for={field.id} class='input_field_placeholder'>
              {field.id}
            </label>
          </div>
        {:else if field.type === "multiSelect"}
          <div class="form_list">
            <h4>{field.id}</h4>
            <div class="select_dropdown">
              <Select multi={true} data={field.values} bind:selectedData={rowConfig.row[sheetConfig.fieldIndexes[field.id]]} />
            </div>
          </div>
        {:else if field.type === "select"}
          <div class="form_list">
            <h4>{field.id}</h4>
            <div class="select_dropdown">
              <Select data={field.values} bind:selectedData={rowConfig.row[sheetConfig.fieldIndexes[field.id]]} />
            </div>
          </div>
        {/if}
      {/if}
    {/each}
  {/if}
</div>
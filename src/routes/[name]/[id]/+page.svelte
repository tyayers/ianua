<script lang="ts">
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { DataConfig, RowConfig, UsageData } from "$lib/interfaces";
  import { appService } from "$lib/app-service";
  import Header from '$lib/components.header.svelte';
  import EditRow from '$lib/components.row.edit.svelte';
	import { PUBLIC_TEST_MODE } from '$env/static/public';
    import { goto } from "$app/navigation";

  export let data: PageData;
  let sheetConfig: DataConfig | undefined = undefined;
  let row: string[] = [];
  let headers: string[] = [];
  let rowConfig: RowConfig | undefined = undefined;

  let links: {name: string, link: string, icon?: string}[] = [];
  let previewEmbedLink: string = "";
  // let likes: string[] = [];
  // let types: string[] = [];
  // let categories: string[] = [];
  // let levels: string[] = [];
  let rowDate: Date;
  let idIndex: number = -1;
  let relatedData: {[key: string]: {prompt: string, sheetConfig: DataConfig, headers: string[], relatedKey: string, addOpen: boolean, newRow: RowConfig, rows: RowConfig[]}} = {};

  onMount(() => {
    document.title = "Loading...";

    appService.LoadData(data.dataName).then((result) => {
      headers = result.headers;
      sheetConfig = appService.GetSheetConfig(data.dataName, headers);
      if (sheetConfig) {
        idIndex = sheetConfig?.tagIndexes["id"][0];
        let tempRow = result.rows.find(item => item[idIndex] === data.rowId);
        if (tempRow) {
          row = tempRow;
          rowConfig = appService.GetRowConfig(sheetConfig, result.headers, row);
        }
        
        if (rowConfig && rowConfig.links) {
          for(let i=0; i<rowConfig.links.length; i++) {
            let tempLink = rowConfig.links[i];
            let tempName = rowConfig.links[i];
            let tempIcon = "/slides.svg";
            if (tempName.length > 40 && sheetConfig.tagIndexes["name"])
              tempName = row[sheetConfig.tagIndexes["name"][0]];

            if (tempLink.startsWith("go/")) {
              tempLink = "http://" + tempLink;
            }
            else if (tempLink.startsWith("https://github.com")) {
              tempIcon = "/github.png";
              tempName = "Source code assets"
            }
            else if (tempLink.startsWith("https://youtu.be")) {
              tempIcon = "/youtube.webp";
              tempName = "YouTube recording"
              let pieces = tempLink.split("/");
              previewEmbedLink = "https://www.youtube.com/embed/" + pieces[pieces.length - 1];
            }
            else if (tempLink.startsWith("https://www.googlecloudcommunity.com")) {
              tempIcon = "/gcloud.png";
              tempName = "Google Cloud Community post"
            }
            else if (tempLink.includes("/presentation/")) {
              if (tempLink.includes("/edit"))
                previewEmbedLink = tempLink.replace("/edit", "/embed");
              else
                previewEmbedLink = tempLink + "/embed";

              tempName += " Doc";
            }
            else if (tempLink.includes("nip.io") || tempLink.includes("run.app")) {
              tempName += " Client App";
              tempIcon = "/app.webp";
            }

            links.push({
              name: tempName,
              link: tempLink,
              icon: tempIcon
            })
          }
        }

        if (sheetConfig?.tagIndexes["date"])
          rowDate = new Date(row[sheetConfig.tagIndexes["date"][0]]);
        
        if (sheetConfig?.tagIndexes["name"])  
          document.title = row[sheetConfig.tagIndexes["name"][0]];

        // go through any related data fields
        sheetConfig.relatedFields.forEach((related) => {
          let relatedInfo: string[] = related.split(".");
          if (relatedInfo.length > 1) {
            let relatedTable = relatedInfo[0];
            let relatedKey = relatedInfo[1];
            appService.LoadData(relatedTable).then((relatedRows) => {
              let relatedSheetConfig = appService.GetSheetConfig(relatedTable, relatedRows.headers);
              if (relatedSheetConfig) {
                relatedData[relatedTable] = {
                  prompt: relatedSheetConfig.prompt,
                  sheetConfig: relatedSheetConfig,
                  headers: relatedRows.headers,
                  relatedKey: relatedKey,
                  newRow: appService.GetRowConfig(relatedSheetConfig, relatedRows.headers),
                  addOpen: false,
                  rows: []
                };
                let relatedIdIndex = relatedRows.headers.indexOf(relatedKey);
                relatedRows.rows.forEach((relatedRow) => {
                  if (relatedRow[relatedIdIndex] === rowConfig?.id) {
                    // we have a related record
                    if (relatedSheetConfig?.tagIndexes["date"] && relatedSheetConfig?.tagIndexes["description"]) {
                      relatedData[relatedTable].rows.unshift(appService.GetRowConfig(relatedSheetConfig, relatedRows.headers, relatedRow));
                    }
                  }
                });

                relatedData = relatedData;
              }
            });
          }
        });

        fetch("/api/data/" + data.dataName + "/usage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(new UsageData(row[sheetConfig.tagIndexes["id"][0]], row[sheetConfig.tagIndexes["name"][0]], "VISIT", (new Date()).toString(), ""))
        }).then((response) => {
          if (response.status != 200) {
            console.error("Could not update usage data - " + response.statusText);
          }
        });
      }
    });
  });

  function likeClick() {
    let method: string = "PATCH";
    if (appService.currentUser && rowConfig && rowConfig.likes.includes(appService.currentUser.email)) {
      method = "DELETE";
      let index = rowConfig.likes.indexOf(appService.currentUser.email);
      if (index >= 0) rowConfig.likes.splice(index, 1);
      rowConfig.likes = rowConfig.likes;
    }
    else if (rowConfig) {
      if (appService.currentUser)
        rowConfig.likes.push(appService.currentUser?.email);
      rowConfig.likes = rowConfig.likes;
    }

    if (rowConfig && sheetConfig?.tagIndexes["likes"])
      rowConfig.row[sheetConfig?.tagIndexes["likes"][0]] = rowConfig.likes.join(",");

    if (PUBLIC_TEST_MODE !== "true" && sheetConfig) {
      let url = `/api/data/${sheetConfig.name}/${row[sheetConfig?.tagIndexes["id"][0]]}/likes?email=${appService.currentUser?.email}&row=${row[row.length - 1]}&column=${sheetConfig.tagIndexes["likes"]}`;
      fetch(url, {
        method: method
      });
    }
  }

  function getLikesClass(likes: string[]): string {
    let result = "likes_number";

    if (likes.length > 0) result += " likes_active";
    if (appService.currentUser && likes.includes(appService.currentUser.email)) result += " likes_user";

    return result;
  }

  function getLikesIconClass(likes: string[]): string {
    let result = "likes_icon";

    if (likes.length > 0) result += " likes_active";
    if (appService.currentUser && likes.includes(appService.currentUser.email)) result += " likes_user";

    return result;
  }

  function getTypeColor(type: string) {
    let result = "";
    if (sheetConfig) {
      result = "background-color: " + sheetConfig.typeColors["default"];

      if (sheetConfig.typeColors[type])
        result = "background-color: " + sheetConfig.typeColors[type];
    }

    return result;
  }

  function openButton(link: string) {
    if (sheetConfig) {
      const nowDate = new Date();
      fetch("/api/data/" + data.dataName + "/usage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(new UsageData(row[sheetConfig.tagIndexes["id"][0]], row[sheetConfig.tagIndexes["name"][0]], "OPEN", nowDate.toString(), link))
      }).then((response) => {
        if (response.status != 200) {
          console.error("Could not update usage data - " + response.statusText);
        }
      });
    }
  }

  function openAddRelated(relatedName: string) {
    if (relatedData[relatedName]) {
      relatedData[relatedName].newRow = appService.GetRowConfig(relatedData[relatedName].sheetConfig, relatedData[relatedName].headers);
      relatedData[relatedName].addOpen = true;
    }
  }

  function submitAddRelated(relatedName: string) {
    if (relatedData[relatedName]) {

      let relatedKeyIndex = relatedData[relatedName].headers.indexOf(relatedData[relatedName].relatedKey);
      relatedData[relatedName].newRow.row[relatedKeyIndex] = data.rowId;
      relatedData[relatedName].rows.unshift(appService.GetRowConfig(relatedData[relatedName].sheetConfig, relatedData[relatedName].headers, relatedData[relatedName].newRow.row));
      relatedData[relatedName].newRow = appService.GetRowConfig(relatedData[relatedName].sheetConfig, relatedData[relatedName].headers);

      relatedData[relatedName].addOpen = false;

      // Post to sheet
      fetch("/api/data/" + relatedName, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(relatedData[relatedName].rows[0].row)
      }).then((response) => {
        // console.log(`Response ${response.status} - ${response.statusText} from asset post.`);
        if (response.status !== 200)
          console.error(`Error creating ${relatedName} row: ${response.status} - ${response.statusText}.`);
      });
    }
  }

  function goBack() {
    if (history.length > 1)
      history.back();
    else
      goto("/");
  }
</script>

<Header />

<div class="page">
  {#if sheetConfig && rowConfig && rowConfig.row.length > 0}
    <div class="back_box">
      <button style="float: left;" class="back_button" on:click={goBack}><svg data-icon-name="arrowBackIcon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path fill-rule="evenodd" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path></svg></button>
      <a style="float: right; position: relative; top: 22px; left: -18px; color: #4285f4;" href={"/" + data.dataName + "/" + row[sheetConfig.tagIndexes["id"][0]] + "/edit"}>Edit</a>
    </div>

    <div class="title" style="">{rowConfig.name}</div>

    {#if previewEmbedLink}
      <div style="margin-bottom: 24px;">
        <iframe width="100%" height="374" src={previewEmbedLink} title="Embedded content preview"></iframe>
      </div>
    {/if}

    <div class="description">
      {rowConfig.description}
    </div>

    <div style="display: flex; width: 100%; margin-top: 22px;">

      {#if sheetConfig.tagIndexes["status"] || sheetConfig.tagIndexes["audience"]}
        <div class="block" style="font-weight: bold; margin-top: 4px; width: 100%;">
          {#if sheetConfig.tagIndexes["status"]}
            {row[sheetConfig.tagIndexes["status"][0]]}
          {/if}
          - 
          {#if sheetConfig.tagIndexes["audience"]} 
            {row[sheetConfig.tagIndexes["audience"][0]]}
          {/if}
        </div>
      {/if}

      <!-- svelte-ignore missing-declaration -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="likes_box" on:click|stopPropagation={likeClick}>
        <span class={getLikesClass(rowConfig.likes)}>
          {rowConfig.likes.length}
        </span>
        <svg
          class={getLikesIconClass(rowConfig.likes)}
          version="1.1"
          id="Layer_1"
          width="21px"
          fill="gray"
          viewBox="0 0 122.88 104.19"
          style="enable-background:new 0 0 122.88 104.19"
          xml:space="preserve"
          ><g
            ><path
              d="M62.63,6.25c0.56-2.85,2.03-4.68,4.04-5.61c1.63-0.76,3.54-0.83,5.52-0.31c1.72,0.45,3.53,1.37,5.26,2.69 c4.69,3.57,9.08,10.3,9.64,18.71c0.17,2.59,0.12,5.35-0.12,8.29c-0.16,1.94-0.41,3.98-0.75,6.1h19.95l0.09,0.01 c3.24,0.13,6.38,0.92,9.03,2.3c2.29,1.2,4.22,2.84,5.56,4.88c1.38,2.1,2.13,4.6,2.02,7.46c-0.08,2.12-0.65,4.42-1.81,6.87 c0.66,2.76,0.97,5.72,0.54,8.32c-0.36,2.21-1.22,4.17-2.76,5.63c0.08,3.65-0.41,6.71-1.39,9.36c-1.01,2.72-2.52,4.98-4.46,6.98 c-0.17,1.75-0.45,3.42-0.89,4.98c-0.55,1.96-1.36,3.76-2.49,5.35l0,0c-3.4,4.8-6.12,4.69-10.43,4.51c-0.6-0.02-1.24-0.05-2.24-0.05 l-39.03,0c-3.51,0-6.27-0.51-8.79-1.77c-2.49-1.25-4.62-3.17-6.89-6.01l-0.58-1.66V47.78l1.98-0.53 c5.03-1.36,8.99-5.66,12.07-10.81c3.16-5.3,5.38-11.5,6.9-16.51V6.76L62.63,6.25L62.63,6.25L62.63,6.25z M4,43.02h29.08 c2.2,0,4,1.8,4,4v53.17c0,2.2-1.8,4-4,4l-29.08,0c-2.2,0-4-1.8-4-4V47.02C0,44.82,1.8,43.02,4,43.02L4,43.02L4,43.02z M68.9,5.48 c-0.43,0.2-0.78,0.7-0.99,1.56V20.3l-0.12,0.76c-1.61,5.37-4.01,12.17-7.55,18.1c-3.33,5.57-7.65,10.36-13.27,12.57v40.61 c1.54,1.83,2.96,3.07,4.52,3.85c1.72,0.86,3.74,1.2,6.42,1.2l39.03,0c0.7,0,1.6,0.04,2.45,0.07c2.56,0.1,4.17,0.17,5.9-2.27v-0.01 c0.75-1.06,1.3-2.31,1.69-3.71c0.42-1.49,0.67-3.15,0.79-4.92l0.82-1.75c1.72-1.63,3.03-3.46,3.87-5.71 c0.86-2.32,1.23-5.11,1.02-8.61l-0.09-1.58l1.34-0.83c0.92-0.57,1.42-1.65,1.63-2.97c0.34-2.1-0.02-4.67-0.67-7.06l0.21-1.93 c1.08-2.07,1.6-3.92,1.67-5.54c0.06-1.68-0.37-3.14-1.17-4.35c-0.84-1.27-2.07-2.31-3.56-3.09c-1.92-1.01-4.24-1.59-6.66-1.69v0.01 l-26.32,0l0.59-3.15c0.57-3.05,0.98-5.96,1.22-8.72c0.23-2.7,0.27-5.21,0.12-7.49c-0.45-6.72-3.89-12.04-7.56-14.83 c-1.17-0.89-2.33-1.5-3.38-1.77C70.04,5.27,69.38,5.26,68.9,5.48L68.9,5.48L68.9,5.48z"
            /></g
          ></svg
        >
      </div>
    </div>

    {#if sheetConfig.tagIndexes["user"]}
      <div class="block">
        By <a href={"https://moma.corp.google.com/search?q=" + row[sheetConfig.tagIndexes["user"][0]]} target="_blank" style="font-weight: bold; color: #3367d6;">{row[sheetConfig.tagIndexes["user"][0]]}</a>
      </div>
    {/if}

    {#if sheetConfig.tagIndexes["date"]}
      <div class="block" style="margin-top: 4px;">
        {row[sheetConfig.tagIndexes["date"][0]]}
      </div>
    {/if}

    <div class="tags_box">
      {#each rowConfig.types as type}
        <span class="tag" style={getTypeColor(type)}>{type}</span>
      {/each}
    </div>

    {#if links.length > 0}
      <h3 style="margin-top: 24px; margin-bottom: 2px;">Links</h3>

      <div class="asset_detail">
        {#each links as link}
          <div>
            <img src={link.icon} width="18px" alt="Link" style="position: relative; top: 2px;" />
            <a href={link.link} style="color: #3367d6;" target="_blank" on:mousedown={() => openButton(link.link)}>{link.name} <svg
              class="right_content_tip_learnmore"
              width="24px" height="24px"
              aria-hidden="true"
              ><path
                fill-rule="evenodd"
                d="M13.85 5H14V4h-4v1h2.15l-5.36 5.364.848.848L13 5.85V8h1V4h-1v.15l.15-.15.85.85-.15.15zM8 4H4.995A1 1 0 004 4.995v8.01a1 1 0 00.995.995h8.01a1 1 0 00.995-.995V10h-1v3H5V5h3V4z"
              ></path></svg
            ></a>
          </div>
        {/each}
      </div>
    {/if}

    {#if rowConfig.categories.length > 0}
      <h3 style="margin-top: 24px; margin-bottom: 2px;">Products</h3>
      <ul>
        {#each rowConfig.categories as category}
          <li>{category}</li>
        {/each}
      </ul>
    {/if}

    {#if rowConfig.levels.length > 0}
      <h3 style="margin-top: 24px; margin-bottom: 2px;">Level</h3>
      <ul>
        {#each rowConfig.levels as level}
          <li>{level}</li>
        {/each}
      </ul>
    {/if}

    {#if sheetConfig.relatedFields.length > 0}
      {#each Object.keys(relatedData) as related}
        <div style="margin-bottom: 64px;">
          <h3 style="margin-top: 24px; margin-bottom: 2px;">{related.charAt(0).toUpperCase() + related.slice(1)}</h3>
          {#if relatedData[related]}
            <div style="font-size: 14px; margin-top: 8px;">
              {relatedData[related].prompt}
            </div>

            {#if !relatedData[related].addOpen}
              <button on:click={() => openAddRelated(related)} style="font-size: 14px; color: rgb(66, 133, 244); margin-top: 8px; font-weight: bold;">+ Add</button>
            {:else}
              <div style="position: relative; top: -8px; padding-left: 14px; width: 70%; margin-bottom: 18px;">
                <EditRow sheetConfig={relatedData[related].sheetConfig} rowConfig={relatedData[related].newRow} />
                <div>
                  <button class="rounded_button_outlined" on:click={() => relatedData[related].addOpen = !relatedData[related].addOpen}>Cancel</button>
                  <button on:click={() => submitAddRelated(related)} class="rounded_button_filled">Submit</button>
                </div>
              </div>
            {/if}

            {#each relatedData[related].rows as relatedRow}
              <div style="margin-top: 16px; font-style: italic; color: rgb(95, 99, 104);">
                {relatedRow.date} - {relatedRow.description}
              </div>
            {/each}
          {/if}
        </div>
      {/each}
    {/if}

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
  .page {
    max-width: 600px;
    margin-top: 64px;
    margin-bottom: 204px;
    margin-left: auto;
    margin-right: auto;
  }

  .back_box {
    position: absolute;
    max-width: 600px;
    top: 50px;
    width: 100%;
    /* display: flex; */
  }

  .back_button {
    position: relative;
    left: -10px;
  }

  .title {
    font-family: "Google Sans", Roboto, Arial, sans-serif;
    line-height: 2.75rem;
    font-size: 2.25rem;
    letter-spacing: 0;
    font-weight: 400;
    color: rgb(32, 33, 36);
    margin-bottom: 30px;
    margin-top: 30px;
    word-break: break-word;
    width: 100%; 
    text-align: left;
  }

  .description {
    font-family: "Google Sans", Roboto, Arial, sans-serif;
    line-height: 1.75rem;
    font-size: 1.375rem;
    letter-spacing: 0;
    font-weight: 400;
    color: rgb(95, 99, 104);
    font-style: italic;
    margin-top: 0;
  }

  .block {
    margin-top: 24px;
    font-family: Roboto, Arial, sans-serif;
    line-height: 1.25rem;
    font-size: .875rem;
    letter-spacing: .0178571429em;
    font-weight: 500;
    color: rgb(60, 64, 67);
    font-weight: 400;
    margin-bottom: 5px;
  }

  .right_content_tip_learnmore {
    fill: #3367d6;
    position: relative;
    top: 10px;
    left: -3px;
  }

  .likes_box {
    width: 10%;
    cursor: pointer;
  }

  .wait {
    cursor: wait;
  }

  .likes_box:hover {
    fill: orange;
    color: orange;
  }

  .likes_number {
    color: gray;
    /* position: absolute;
    bottom: -2px; */
    right: 26px;
  }

  .likes_active {
    fill: rgb(0, 0, 0);
    color: rgb(0, 0, 0);
    /* font-weight: bold; */
  }

  .likes_user {
    /* fill: #3367d6;
    color: #3367d6; */

    fill: #e78300;
    color: #e78300;
  }

  .tags_box {
    margin-top: 24px;
    width: 85%;
    display: flex;
    flex-wrap: wrap;
  }

  .tag {
    padding: 2px 8px 2px 8px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: bold;
    color: white;
    margin-right: 6px;
    margin-bottom: 4px;
  }
</style>
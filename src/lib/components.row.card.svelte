<script lang="ts">
	import { appService } from "./app-service";
	import { Asset, AssetType, DataConfig } from "./interfaces";
	import { PUBLIC_TEST_MODE } from '$env/static/public';
  import { goto } from "$app/navigation";
  import { assets } from "$app/paths";

  export let row: string[];
  export let sheetConfig: DataConfig;

  $: id = row[sheetConfig.tagIndexes["id"]];
  $: name = row[sheetConfig.tagIndexes["name"]];
  $: description = row[sheetConfig.tagIndexes["description"]];
  $: date = row[sheetConfig.tagIndexes["date"]];
  $: audience = row[sheetConfig.tagIndexes["audience"]];
  let likes = sheetConfig.tagIndexes["likes"] && row[sheetConfig.tagIndexes["likes"]].length > 0 ? row[sheetConfig.tagIndexes["likes"]].split(",") : [];
  $: types = !sheetConfig.tagIndexes["type"] ? [] : row[sheetConfig.tagIndexes["type"]].split(",").map((item) => {
    return item.trim();
  });
  $: categories = !sheetConfig.tagIndexes["category"] ? [] : row[sheetConfig.tagIndexes["category"]].split(",").map((item) => {
    return item.trim();
  });
  
  function getTypeColor(type: string) {
    let result = "background-color: " + sheetConfig.typeColors["default"];

    if (sheetConfig.typeColors[type])
      result = "background-color: " + sheetConfig.typeColors[type];

    return result;
  }

  function likeClick() {
    // processing = true;
    let method: string = "PATCH";
    if (appService.currentUser && likes.includes(appService.currentUser.email)) {
      method = "DELETE";
      let index = likes.indexOf(appService.currentUser.email);
      if (index >= 0) likes.splice(index, 1);
    }
    else {
      if (appService.currentUser)
        likes.push(appService.currentUser?.email);
    }

    likes = likes;
    console.log(likes);
    if (PUBLIC_TEST_MODE != "true") {
      let url = `/api/data/${sheetConfig.name}/${id}/likes?email=${appService.currentUser?.email}&row=${row[row.length - 1]}&column=${sheetConfig.tagIndexes["likes"]}`;
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

  function daysAgo(date: Date): number {
    let today = new Date();

    let Difference_In_Time = today.getTime() - date.getTime();

    // Calculating the no. of days between
    // two dates
    let Difference_In_Days =
        Math.round
            (Difference_In_Time / (1000 * 3600 * 24));

    //d.setDate(d.getDate() - Math.abs(n));
    return Difference_In_Days;
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<a href={"/" + sheetConfig.name + "/" + id} class="card_box">
  <div style="display: flex; margin-bottom: 4px;">

    {#each categories as category}
      {#if sheetConfig.categoryIcons[category]}
        <img height="32px" alt="Product" title={category} src={sheetConfig.categoryIcons[category]} />
      {/if}
    {/each}
  </div>
  {#if name}
    {name}
  {:else}
    {id}
  {/if}
  <div class="card_owner_box">
    {daysAgo(new Date(date)) + " days ago"}
    {#if audience}
       - 
      {audience}
    {/if}
  </div>
  <div class="card_description_box">
    {description}
  </div>
  <div class="card_footer" style="">
    <div class="tags_box">
      {#each types as type}
      <span class="tag" style={getTypeColor(type)}>{type}</span>
      {/each}
    </div>
    <div class="likes_box" on:click|preventDefault={likeClick}>
      <span class={getLikesClass(likes)}>
        {likes.length}
      </span>
      <svg
        class={getLikesIconClass(likes)}
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

</a>

<style>
  .card_box {
    color: black;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 5px 0px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 3px 1px -2px;
    padding: 16px 20px;
    transition: box-shadow 0.2s ease 0s;
    width: 246px;
    height: 246px;
    margin: 14px;
    position: relative;
  }

  .card_box:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 3px 5px -1px, rgba(0, 0, 0, 0.14) 0px 6px 10px 0px, rgba(0, 0, 0, 0.12) 0px 1px 18px 0px;
    cursor: pointer;
  }

  .card_owner_box {
    margin-top: 2px;
    font-size: 13px;
    font-weight: 300;
    color: rgb(0,0,0,.66);
  }

  .card_description_box {
    font-size: 13px;
    line-height: 20px;
    margin-top: 8px;
    max-height: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  }

  .card_footer {
    display: flex; 
    width: 90%;
    position: absolute;
    bottom: 10px;
  }

  .likes_box {
    width: 10%;
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
    position: absolute;
    bottom: -2px;
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

  /* .likes_number:hover {
    color: orange;
  } */

  .likes_icon {
    position: absolute;
    bottom: 2px;
    right: 0px;
  }

  /* .likes_icon:hover {
    fill: orange;
  } */

  .tags_box {

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

  .tag_green {
    background-color: rgb(85, 153, 85);
  }

  .tag_red {
    background-color: rgb(240, 74, 74);
  }

  .tag_orange {
    background-color: orange;
  }

  .tag_blue {
    background-color: #3367d6;
  }
</style>
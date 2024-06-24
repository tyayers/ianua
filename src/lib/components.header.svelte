<script lang="ts">
  import { onMount } from 'svelte';
  import { User } from './interfaces';
  import { appService } from './app-service';
	import { goto } from '$app/navigation';

  let currentUser: User | undefined = appService.currentUser;
  let showAddButton: boolean = true;
  let menuVisible: boolean = false;

  onMount(async () => {
    if (window.location.pathname != "/") {
      showAddButton = false;
    }

    document.addEventListener("userUpdated", () => {
      currentUser = appService.currentUser;
    });

    document.addEventListener("cancelEvent", () => {
      menuVisible = false;
    });
  });

  function goToPublish() {
    goto("/admin/products/new");

    //First, we initialize our event
    const event = new Event('cancelEvent');
    // Next, we dispatch the event.
    document.dispatchEvent(event);
  }

  function signOut() {
    appService.SignOut();

    //First, we initialize our event
    const event = new Event('cancelEvent');
    // Next, we dispatch the event.
    document.dispatchEvent(event);

    goto("/");
  }

  function goToAddAsset() {
    goto("/assets/new");
  } 

</script>

<div class="header">
  <span class="header_left_panel1">
    <!-- <a href="/home">
      <img class="leader_left_panel1_logo" src="/loop.svg" alt="Data Marketplace" />
      <span class="header_left_panel1_name">{appService.siteName}</span>
    </a> -->

  </span>

  <span class="header_right_panel1">
    
    {#if currentUser}

      <button style="position: relative; top: -14px; left: -28px;" on:click={goToAddAsset} class="rounded_button_outlined">+ Add asset</button>

      <button style="position: relative; top: -4px; left: -10px;" class="back_button">
        <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"><path fill="#333" d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path></svg>
      </button>

      <button
        on:click|stopPropagation={() => { menuVisible = !menuVisible; }}
        on:keydown|stopPropagation={() => { menuVisible = !menuVisible; }}
        class="profile_button"
      >
        <img class="profile_button_image" src={currentUser.photoUrl} onerror="this.src='/avatar.png';" alt="The user's profile." />
      </button>

      {#if menuVisible}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="menuPanel" on:click|stopPropagation={() => {}}>
          <div class="arrow" />
          <div class="menu">
            <div class="menu_profile">
              <img class="panel_profile_image" src={currentUser.photoUrl} onerror="this.src='/avatar.png';" alt="Profile"/>
              <div class="profile_info">
                <!-- <div class="profile_info_primary">{currentUser.userName}</div> -->
                <div class="profile_info_secondary" title={currentUser.email}>{currentUser.email}</div>
                <!-- <div class="profile_info_secondary profile_info_divide">{currentUser.providerId}</div> -->
              </div>
            </div>
            <div class="panel">
              
              <!-- {#if currentUser?.roles.includes("admin")}
                <button class="result" on:click={goToAdmin} style="width: 97%;">Admin</button>
              {/if} -->
              <!-- <button class="result" on:click={signOut}>Sign out</button>
              <button class="result" on:click={signOut}>My account</button> -->
              
            </div>
          </div>
        </div>
      {/if}

    {:else}
      <!-- <span>
        <a href="/sign-in" class="rounded_button_filled">Sign In</a>
        <a href="/register" class="rounded_button_outlined">Register</a>
      </span> -->
    {/if}
  </span>
</div>

<style>
  .header {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: flex-start;

    height: var(--header-height);
    background-color: rgba(255, 255, 255, 1);
    width: 100vw;
    /* border-bottom: solid 1px rgba(222, 222, 222, 1); */

    font-weight: 560;
    color: #333;
    font-size: 20px;

    padding: 0px;
    margin: 0px;

    position: sticky;
    top: 0;
    z-index: 2;
  }

  .header_left_panel1 {
    margin-top: 12px;
    margin-left: 24px;
    cursor: pointer;
    display: flex;
  }

  .header_left_panel1_name {
    font-family: "Open Sans", sans-serif;;
    color: #2c2c2c;
    font-weight: 550;
    position: relative;
    top: -12px;
    left: 4px;
  }

  .leader_left_panel1_logo {
    width: 36px;
  }

  .header_right_panel1 {
    margin-top: 7px;
    margin-right: 24px;
  }

  .profile_button {
    position: relative;
    top: 2px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
  }

  .profile_button_image {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .menuPanel {
    position: absolute;
    top: 50px;
    margin-top: 8px;
    right: 10px;
    background: rgb(255, 255, 255);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;
    border: 1px solid rgb(242, 242, 242);
  }

  .menu {
    /* position: relative;
    left: -4px;
    top: -1px; */
    height: 122px;
    width: 300px;
    overflow-y: hidden;
    background-color: rgb(255, 255, 255);
    /* box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;
    border: 1px solid rgb(242, 242, 242);
    border-radius: 4px; */
    z-index: 2;
    position: relative;
    top: -15px;
  }

  .menu_profile {
    display: flex;
  }

  .profile_info {
    margin-top: 32px;
    margin-left: 18px;
  }

  .profile_info_primary {
    font-size: 16px;
  }

  .profile_info_secondary {
    font-size: 14px;
    font-weight: normal;
    margin-top: 2px;
    margin-left: 2px;
    width: 145px;
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
  }

  .profile_info_divide {
    margin-top: 16px;
  }

  .panel_profile_image {
    margin-left: 20px;
    margin-top: 20px;
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .panel {
    /* position: relative; */
    background: rgb(255, 255, 255);
    /* height: 100%; */
    padding-left: 10px;
    padding-right: 10px;
    margin-top: 18px;
    z-index: 2;
    padding-top: 10px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row-reverse;
    align-items: flex-end;
    height: 73px;
    /* padding-bottom: 20px; */
    /* font-family: sohne, "Helvetica Neue", Helvetica, Arial, sans-serif; */
  }

  .arrow {
    position: relative;
    top: -29px;
    left: 259px;
    border: 1px solid rgb(242, 242, 242);
    box-shadow: rgba(0, 0, 0, 0.15) -1px -1px 1px -1px;
    transform: rotate(45deg) translate(16px, 16px);
    background: rgb(255, 255, 255);
    height: 14px;
    width: 14px;
    display: block;
    content: "";
    pointer-events: none;
    z-index: 1;
    /* border: 1px solid red; */
  }
  
  .result {
    display: block;
    padding-top: 6px;
    padding-bottom: 6px;
    padding-left: 10px;
    color: black;
    /* border-bottom: 1px dashed rgb(242, 242, 242); */
    cursor: pointer;
    font-size: 16px;
    text-decoration: none;
    font-weight: 200;
    background-color: transparent;
    border-width: 0px;
    width:47%;
    text-align: center;
    margin: 4px;
    border-color: rgba(0, 0, 0, 0.12);
    color: rgba(0, 0, 0, 0.66);
    font-weight: 400;
    background-color: #fdfdfd;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 2px;
    font-size: 14px;
    /* border-bottom: 1px solid #dddddd; */
    /* width: 300px; */
    border-radius: 5px;
  }

  .result:hover {
    background-color: #f1f1f1;
  }

</style>
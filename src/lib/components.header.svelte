<script lang="ts">
  import { onMount } from 'svelte';
  import { User } from './interfaces';
  import { appService } from './app-service';
	import { goto } from '$app/navigation';

  export let actionButtonText: string = "";
  export let actionButtonColor: string = "white";
  export let actionButtonTextColor: string = "#6595fc";
  export let actionEvent: (actionButtonText: string) => void = ((buttonText) => {
    console.log(buttonText);
  });

  export let showAlertButton: boolean = false;
  export let alerts: {date: string, alert: string, link: string}[] = [];
  export let alertsClick: () => void = () => {};

  export let showMenuButton: boolean = false;
  export let menuClick: () => void = () => {};
  
  let currentUser: User | undefined = appService.currentUser;
  let menuVisible: boolean = false;
  let alertsVisible: boolean = false;
  let badgeVisible: boolean = true;

  onMount(async () => {

    document.addEventListener("userUpdated", () => {
      currentUser = appService.currentUser;
    });

    document.addEventListener("cancelEvent", () => {
      menuVisible = false;
      alertsVisible = false;
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
    // appService.SignOut();

    //First, we initialize our event
    const event = new Event('cancelEvent');
    // Next, we dispatch the event.
    document.dispatchEvent(event);

    goto("/");
  }

  function onProfileClick() {
    menuVisible = !menuVisible;
    alertsVisible = false;
  }

  function onAlertsClick() {
    alertsVisible = !alertsVisible;
    menuVisible = false;
    badgeVisible = false;
    if (alertsClick) {
      alertsClick();
    }
  }

  function onMenuClick() {
    if (menuClick) menuClick();
  }

  function triggerAction() {
    if (actionEvent) actionEvent(actionButtonText);
  }

</script>

<div class="header">
  <span class="header_left_panel1">

    {#if showMenuButton}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <svg class="menu_button" on:click|stopPropagation={menuClick} style="position: relative; top: -2px; left: -4px;" width="28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 6H20M4 12H20M4 18H20" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

      <a href="/">
        <img class="leader_left_panel1_logo" src="/apigee-logo-colorful.png" alt="Data Marketplace" />
        <span class="header_left_panel1_name">{appService.siteName}</span>
      </a>
    {/if}

  </span>

  <span class="header_right_panel1">
    
    {#if currentUser}

      {#if actionButtonText}
        <button style={"position: relative; top: -14px; left: -28px; background-color: " + actionButtonColor + "; color: " + actionButtonTextColor} on:click|stopPropagation={triggerAction} class="rounded_button_outlined">{actionButtonText}</button>
      {/if}

      {#if showAlertButton}
        <button style="position: relative; top: -4px; left: -10px;" class="back_button" on:click|stopPropagation={onAlertsClick}>
          <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"><path fill="#333" d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path></svg>
        </button>
        {#if alerts.length > 0 && badgeVisible}
          <span class="alert_badge">{alerts.length}</span>
        {/if}
      {/if}

      <button
        on:click|stopPropagation={onProfileClick}
        on:keydown|stopPropagation={onProfileClick}
        class="profile_button"
      >
        <img class="profile_button_image" src={currentUser.photoUrl} onerror="this.src='/avatar.png';" alt="The user's profile." />
      </button>

      {#if alertsVisible}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="menuPanel" on:click|stopPropagation={() => {}} style="right: 64px; min-height: 80px; max-height: 600px; overflow-y: auto; height: auto;">
          <div class="arrow" />
          <div class="menu" style="height: auto; width: 364px;">
            {#if alerts.length === 0}
              <div style="margin-left: auto; margin-right: auto; padding-top: 24px; font-size: 18px; color: lightgray; text-align: center;">No alerts</div>
            {:else}
              {#each alerts as alert}
                <div class="alert_box">
                  <a href={alert.link}>
                    <div style="color: #afafaf; font-size: 14px; padding-left: 8px; padding-top: 8px;">
                      {alert.date}
                    </div>
                    <div style="font-weight: normal; padding-top: 4px; padding-left: 8px; padding-bottom: 12px; color: #474747; font-size: 18px;">
                      {alert.alert}
                    </div>
                  </a>
                </div>
              {/each}
            {/if}
          </div>
        </div>
      {/if}

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
    /* width: 100vw; */
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

  @media (min-width: 1470px) {
    .menu_button {
      display: none;
    }
  }

  .alert_badge {
    position: absolute;
    z-index: 3;
    right: 75px;
    top: 28px;
    background: #EA4335;
    border-radius: 24px;
    padding: 4px;
    font-size: 12px;
    color: white;
    min-width: 13px;
    text-align: center;
  }

  .alert_box {

  }

  .alert_box:hover {
    background-color: #f4f4f4;
    cursor: pointer;
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
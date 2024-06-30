import { c as create_ssr_component, d as add_attribute, e as escape } from "./ssr.js";
import "./client.js";
class RowConfig {
  id = "";
  name = "";
  description = "";
  date = "";
  tags = {};
  row = [];
}
class AppService {
  tempFirstName = "";
  tempLastName = "";
  siteName = "Apigee Assets";
  currentUser = void 0;
  currentUserLoaded = false;
  config = void 0;
  reloadFlag = false;
  googleAccessToken = "";
  data = {};
  sheetConfig = {};
  testMode = false;
  setHeaderAction = (fds) => {
    console.log(fds);
  };
  constructor() {
    if (!this.siteName)
      this.siteName = "Data Marketplace";
  }
  SetHeaderAction(buttonText) {
    this.setHeaderAction(buttonText);
  }
  LoadUser(email) {
    if (this.currentUser) {
      this.currentUser.email = email;
    }
  }
  GetSheetConfig(name, headers) {
    if (this.sheetConfig[name])
      return this.sheetConfig[name];
    else {
      const dataConfig = this.config?.data.find((sheet) => sheet.name === name);
      if (dataConfig) {
        if (!dataConfig.tagIndexes)
          dataConfig.tagIndexes = {};
        if (!dataConfig.fieldIndexes)
          dataConfig.fieldIndexes = {};
        if (!dataConfig.relatedFields)
          dataConfig.relatedFields = [];
        headers.forEach((header, i) => {
          const fieldConfig = dataConfig.fields.find((field) => field.id === header);
          if (fieldConfig && fieldConfig.tags) {
            fieldConfig.tags.forEach((tag) => {
              if (!dataConfig.tagIndexes[tag])
                dataConfig.tagIndexes[tag] = [];
              dataConfig.tagIndexes[tag].push(i);
            });
          }
          dataConfig.fieldIndexes[header] = i;
        });
        dataConfig.fields.forEach((field) => {
          if (field.type === "related") {
            dataConfig.relatedFields.push(field.relatedKey);
          }
        });
        this.sheetConfig[name] = dataConfig;
      }
      return dataConfig;
    }
  }
  GetRowConfig(sheetConfig, headers, row = void 0) {
    const result = new RowConfig();
    if (!row) {
      result.row = Array(headers.length - 1).fill("");
      sheetConfig.fields.forEach((field) => {
        if (field.initialValue) {
          const rowIndex = headers.indexOf(field.id);
          if (field.initialValue === "CURRENT_USER" && this.currentUser)
            result.row[rowIndex] = this.currentUser.email;
          else if (field.initialValue === "TODAY") {
            const startDate = /* @__PURE__ */ new Date();
            const startDateString = (startDate.getMonth() + 1).toString() + "/" + startDate.getDate().toString() + "/" + startDate.getFullYear().toString();
            result.row[rowIndex] = startDateString;
          } else
            result.row[rowIndex] = field.initialValue;
        }
      });
    } else {
      result.row = row;
    }
    for (const [key, value] of Object.entries(sheetConfig.tagIndexes)) {
      value.forEach((index) => {
        if (result.tags[key])
          result.tags[key] += " - " + result.row[index];
        else
          result.tags[key] = result.row[index];
        if (key === "id")
          result.id = result.row[index];
        if (key === "name")
          result.name = result.row[index];
        if (key === "description") {
          if (result.description)
            result.description += " - " + result.row[index];
          else
            result.description = result.row[index];
        }
        if (key === "date")
          result.date = result.row[index];
      });
    }
    return result;
  }
  LoadData(name) {
    return new Promise((resolve) => {
      if (!this.data[name]) {
        let url = "/api/data/" + name;
        fetch(url).then((response) => {
          return response.json();
        }).then((result) => {
          this.data[name] = result;
          resolve(result);
        });
      } else {
        resolve(this.data[name]);
      }
    });
  }
  ShowSnackbar(message) {
    const x = document.getElementById("snackbar");
    if (x) {
      x.innerHTML = message;
      x.className = "show";
    }
    setTimeout(function() {
      if (x) {
        x.className = x.className.replace("show", "");
      }
    }, 3e3);
  }
}
const appService = new AppService();
const css = {
  code: '.header.svelte-1w3jnz4{display:flex;flex-flow:row wrap;justify-content:space-between;align-items:flex-start;height:var(--header-height);background-color:rgba(255, 255, 255, 1);width:100vw;font-weight:560;color:#333;font-size:20px;padding:0px;margin:0px;position:sticky;top:0;z-index:2}.header_left_panel1.svelte-1w3jnz4{margin-top:12px;margin-left:24px;cursor:pointer;display:flex}.header_right_panel1.svelte-1w3jnz4{margin-top:7px;margin-right:24px}.profile_button.svelte-1w3jnz4{position:relative;top:2px;width:40px;height:40px;border-radius:50%;cursor:pointer}.profile_button_image.svelte-1w3jnz4{width:40px;height:40px;border-radius:50%}.menuPanel.svelte-1w3jnz4{position:absolute;top:50px;margin-top:8px;right:10px;background:rgb(255, 255, 255);box-shadow:rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;border:1px solid rgb(242, 242, 242)}.menu.svelte-1w3jnz4{height:122px;width:300px;overflow-y:hidden;background-color:rgb(255, 255, 255);z-index:2;position:relative;top:-15px}.menu_profile.svelte-1w3jnz4{display:flex}.profile_info.svelte-1w3jnz4{margin-top:32px;margin-left:18px}.profile_info_secondary.svelte-1w3jnz4{font-size:14px;font-weight:normal;margin-top:2px;margin-left:2px;width:145px;text-overflow:ellipsis;overflow-wrap:anywhere}.panel_profile_image.svelte-1w3jnz4{margin-left:20px;margin-top:20px;width:100px;height:100px;border-radius:50%}.panel.svelte-1w3jnz4{background:rgb(255, 255, 255);padding-left:10px;padding-right:10px;margin-top:18px;z-index:2;padding-top:10px;display:flex;flex-wrap:wrap;flex-direction:row-reverse;align-items:flex-end;height:73px}.arrow.svelte-1w3jnz4{position:relative;top:-29px;left:259px;border:1px solid rgb(242, 242, 242);box-shadow:rgba(0, 0, 0, 0.15) -1px -1px 1px -1px;transform:rotate(45deg) translate(16px, 16px);background:rgb(255, 255, 255);height:14px;width:14px;display:block;content:"";pointer-events:none;z-index:1}',
  map: `{"version":3,"file":"components.header.svelte","sources":["components.header.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount } from \\"svelte\\";\\nimport { User } from \\"./interfaces\\";\\nimport { appService } from \\"./app-service\\";\\nimport { goto } from \\"$app/navigation\\";\\nexport let actionButtonText = \\"\\";\\nexport let actionButtonColor = \\"white\\";\\nexport let actionButtonTextColor = \\"#6595fc\\";\\nexport let actionEvent = (buttonText) => {\\n  console.log(buttonText);\\n};\\nlet currentUser = appService.currentUser;\\nlet menuVisible = false;\\nonMount(async () => {\\n  document.addEventListener(\\"userUpdated\\", () => {\\n    currentUser = appService.currentUser;\\n  });\\n  document.addEventListener(\\"cancelEvent\\", () => {\\n    menuVisible = false;\\n  });\\n});\\nfunction goToPublish() {\\n  goto(\\"/admin/products/new\\");\\n  const event = new Event(\\"cancelEvent\\");\\n  document.dispatchEvent(event);\\n}\\nfunction signOut() {\\n  const event = new Event(\\"cancelEvent\\");\\n  document.dispatchEvent(event);\\n  goto(\\"/\\");\\n}\\nfunction triggerAction() {\\n  if (actionEvent)\\n    actionEvent(actionButtonText);\\n}\\n<\/script>\\n\\n<div class=\\"header\\">\\n  <span class=\\"header_left_panel1\\">\\n    <!-- <a href=\\"/home\\">\\n      <img class=\\"leader_left_panel1_logo\\" src=\\"/loop.svg\\" alt=\\"Data Marketplace\\" />\\n      <span class=\\"header_left_panel1_name\\">{appService.siteName}</span>\\n    </a> -->\\n\\n  </span>\\n\\n  <span class=\\"header_right_panel1\\">\\n    \\n    {#if currentUser}\\n\\n      {#if actionButtonText}\\n        <button style={\\"position: relative; top: -14px; left: -28px; background-color: \\" + actionButtonColor + \\"; color: \\" + actionButtonTextColor} on:click|stopPropagation={triggerAction} class=\\"rounded_button_outlined\\">{actionButtonText}</button>\\n      {/if}\\n\\n      <button style=\\"position: relative; top: -4px; left: -10px;\\" class=\\"back_button\\">\\n        <svg width=\\"100%\\" height=\\"100%\\" viewBox=\\"0 0 24 24\\" preserveAspectRatio=\\"xMidYMid meet\\" focusable=\\"false\\"><path fill=\\"#333\\" d=\\"M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z\\"></path></svg>\\n      </button>\\n\\n      <button\\n        on:click|stopPropagation={() => { menuVisible = !menuVisible; }}\\n        on:keydown|stopPropagation={() => { menuVisible = !menuVisible; }}\\n        class=\\"profile_button\\"\\n      >\\n        <img class=\\"profile_button_image\\" src={currentUser.photoUrl} onerror=\\"this.src='/avatar.png';\\" alt=\\"The user's profile.\\" />\\n      </button>\\n\\n      {#if menuVisible}\\n        <!-- svelte-ignore a11y-no-static-element-interactions -->\\n        <!-- svelte-ignore a11y-click-events-have-key-events -->\\n        <div class=\\"menuPanel\\" on:click|stopPropagation={() => {}}>\\n          <div class=\\"arrow\\" />\\n          <div class=\\"menu\\">\\n            <div class=\\"menu_profile\\">\\n              <img class=\\"panel_profile_image\\" src={currentUser.photoUrl} onerror=\\"this.src='/avatar.png';\\" alt=\\"Profile\\"/>\\n              <div class=\\"profile_info\\">\\n                <!-- <div class=\\"profile_info_primary\\">{currentUser.userName}</div> -->\\n                <div class=\\"profile_info_secondary\\" title={currentUser.email}>{currentUser.email}</div>\\n                <!-- <div class=\\"profile_info_secondary profile_info_divide\\">{currentUser.providerId}</div> -->\\n              </div>\\n            </div>\\n            <div class=\\"panel\\">\\n              \\n              <!-- {#if currentUser?.roles.includes(\\"admin\\")}\\n                <button class=\\"result\\" on:click={goToAdmin} style=\\"width: 97%;\\">Admin</button>\\n              {/if} -->\\n              <!-- <button class=\\"result\\" on:click={signOut}>Sign out</button>\\n              <button class=\\"result\\" on:click={signOut}>My account</button> -->\\n              \\n            </div>\\n          </div>\\n        </div>\\n      {/if}\\n\\n    {:else}\\n      <!-- <span>\\n        <a href=\\"/sign-in\\" class=\\"rounded_button_filled\\">Sign In</a>\\n        <a href=\\"/register\\" class=\\"rounded_button_outlined\\">Register</a>\\n      </span> -->\\n    {/if}\\n  </span>\\n</div>\\n\\n<style>\\n  .header {\\n    display: flex;\\n    flex-flow: row wrap;\\n    justify-content: space-between;\\n    align-items: flex-start;\\n\\n    height: var(--header-height);\\n    background-color: rgba(255, 255, 255, 1);\\n    width: 100vw;\\n    /* border-bottom: solid 1px rgba(222, 222, 222, 1); */\\n\\n    font-weight: 560;\\n    color: #333;\\n    font-size: 20px;\\n\\n    padding: 0px;\\n    margin: 0px;\\n\\n    position: sticky;\\n    top: 0;\\n    z-index: 2;\\n  }\\n\\n  .header_left_panel1 {\\n    margin-top: 12px;\\n    margin-left: 24px;\\n    cursor: pointer;\\n    display: flex;\\n  }\\n\\n  .header_left_panel1_name {\\n    font-family: \\"Open Sans\\", sans-serif;;\\n    color: #2c2c2c;\\n    font-weight: 550;\\n    position: relative;\\n    top: -12px;\\n    left: 4px;\\n  }\\n\\n  .leader_left_panel1_logo {\\n    width: 36px;\\n  }\\n\\n  .header_right_panel1 {\\n    margin-top: 7px;\\n    margin-right: 24px;\\n  }\\n\\n  .profile_button {\\n    position: relative;\\n    top: 2px;\\n    width: 40px;\\n    height: 40px;\\n    border-radius: 50%;\\n    cursor: pointer;\\n  }\\n\\n  .profile_button_image {\\n    width: 40px;\\n    height: 40px;\\n    border-radius: 50%;\\n  }\\n\\n  .menuPanel {\\n    position: absolute;\\n    top: 50px;\\n    margin-top: 8px;\\n    right: 10px;\\n    background: rgb(255, 255, 255);\\n    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;\\n    border: 1px solid rgb(242, 242, 242);\\n  }\\n\\n  .menu {\\n    /* position: relative;\\n    left: -4px;\\n    top: -1px; */\\n    height: 122px;\\n    width: 300px;\\n    overflow-y: hidden;\\n    background-color: rgb(255, 255, 255);\\n    /* box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 10px 0px;\\n    border: 1px solid rgb(242, 242, 242);\\n    border-radius: 4px; */\\n    z-index: 2;\\n    position: relative;\\n    top: -15px;\\n  }\\n\\n  .menu_profile {\\n    display: flex;\\n  }\\n\\n  .profile_info {\\n    margin-top: 32px;\\n    margin-left: 18px;\\n  }\\n\\n  .profile_info_primary {\\n    font-size: 16px;\\n  }\\n\\n  .profile_info_secondary {\\n    font-size: 14px;\\n    font-weight: normal;\\n    margin-top: 2px;\\n    margin-left: 2px;\\n    width: 145px;\\n    text-overflow: ellipsis;\\n    overflow-wrap: anywhere;\\n  }\\n\\n  .profile_info_divide {\\n    margin-top: 16px;\\n  }\\n\\n  .panel_profile_image {\\n    margin-left: 20px;\\n    margin-top: 20px;\\n    width: 100px;\\n    height: 100px;\\n    border-radius: 50%;\\n  }\\n\\n  .panel {\\n    /* position: relative; */\\n    background: rgb(255, 255, 255);\\n    /* height: 100%; */\\n    padding-left: 10px;\\n    padding-right: 10px;\\n    margin-top: 18px;\\n    z-index: 2;\\n    padding-top: 10px;\\n    display: flex;\\n    flex-wrap: wrap;\\n    flex-direction: row-reverse;\\n    align-items: flex-end;\\n    height: 73px;\\n    /* padding-bottom: 20px; */\\n    /* font-family: sohne, \\"Helvetica Neue\\", Helvetica, Arial, sans-serif; */\\n  }\\n\\n  .arrow {\\n    position: relative;\\n    top: -29px;\\n    left: 259px;\\n    border: 1px solid rgb(242, 242, 242);\\n    box-shadow: rgba(0, 0, 0, 0.15) -1px -1px 1px -1px;\\n    transform: rotate(45deg) translate(16px, 16px);\\n    background: rgb(255, 255, 255);\\n    height: 14px;\\n    width: 14px;\\n    display: block;\\n    content: \\"\\";\\n    pointer-events: none;\\n    z-index: 1;\\n    /* border: 1px solid red; */\\n  }\\n  \\n  .result {\\n    display: block;\\n    padding-top: 6px;\\n    padding-bottom: 6px;\\n    padding-left: 10px;\\n    color: black;\\n    /* border-bottom: 1px dashed rgb(242, 242, 242); */\\n    cursor: pointer;\\n    font-size: 16px;\\n    text-decoration: none;\\n    font-weight: 200;\\n    background-color: transparent;\\n    border-width: 0px;\\n    width:47%;\\n    text-align: center;\\n    margin: 4px;\\n    border-color: rgba(0, 0, 0, 0.12);\\n    color: rgba(0, 0, 0, 0.66);\\n    font-weight: 400;\\n    background-color: #fdfdfd;\\n    border: 1px solid rgba(0, 0, 0, 0.12);\\n    border-radius: 2px;\\n    font-size: 14px;\\n    /* border-bottom: 1px solid #dddddd; */\\n    /* width: 300px; */\\n    border-radius: 5px;\\n  }\\n\\n  .result:hover {\\n    background-color: #f1f1f1;\\n  }\\n\\n</style>"],"names":[],"mappings":"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"}`
};
const Components_header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { actionButtonText = "" } = $$props;
  let { actionButtonColor = "white" } = $$props;
  let { actionButtonTextColor = "#6595fc" } = $$props;
  let { actionEvent = (buttonText) => {
    console.log(buttonText);
  } } = $$props;
  let currentUser = appService.currentUser;
  if ($$props.actionButtonText === void 0 && $$bindings.actionButtonText && actionButtonText !== void 0)
    $$bindings.actionButtonText(actionButtonText);
  if ($$props.actionButtonColor === void 0 && $$bindings.actionButtonColor && actionButtonColor !== void 0)
    $$bindings.actionButtonColor(actionButtonColor);
  if ($$props.actionButtonTextColor === void 0 && $$bindings.actionButtonTextColor && actionButtonTextColor !== void 0)
    $$bindings.actionButtonTextColor(actionButtonTextColor);
  if ($$props.actionEvent === void 0 && $$bindings.actionEvent && actionEvent !== void 0)
    $$bindings.actionEvent(actionEvent);
  $$result.css.add(css);
  return `<div class="header svelte-1w3jnz4"><span class="header_left_panel1 svelte-1w3jnz4" data-svelte-h="svelte-15vukvy"></span> <span class="header_right_panel1 svelte-1w3jnz4">${currentUser ? `${actionButtonText ? `<button${add_attribute("style", "position: relative; top: -14px; left: -28px; background-color: " + actionButtonColor + "; color: " + actionButtonTextColor, 0)} class="rounded_button_outlined">${escape(actionButtonText)}</button>` : ``} <button style="position: relative; top: -4px; left: -10px;" class="back_button" data-svelte-h="svelte-1tm8jaq"><svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false"><path fill="#333" d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2z"></path></svg></button> <button class="profile_button svelte-1w3jnz4"><img class="profile_button_image svelte-1w3jnz4"${add_attribute("src", currentUser.photoUrl, 0)} onerror="this.src='/avatar.png';" alt="The user's profile."></button> ${``}` : ``}</span> </div>`;
});
export {
  Components_header as C,
  RowConfig as R,
  appService as a
};

import { Config, DataConfig, RowConfig, User } from "./interfaces";
import { browser } from '$app/environment';
import { PUBLIC_TEST_MODE, PUBLIC_TEST_EMAIL } from '$env/static/public';

export class AppService {
  tempFirstName: string = "";
  tempLastName: string = "";
  siteName: string = "Apigee Assets";

  currentUser: User | undefined = undefined;
  currentUserLoaded: boolean = false;
  config: Config | undefined = undefined;
  reloadFlag: boolean = false;
  googleAccessToken: string = "";
  data: {[key: string]: {headers: string[], rows: string[][]}} = {};
  sheetConfig: {[key: string]: DataConfig | undefined} = {};
  testMode: boolean = false;

  constructor() {
    if (!this.siteName) this.siteName = "Data Marketplace";

    if (browser) {
      document.title = this.siteName;
      this.currentUser = new User(PUBLIC_TEST_EMAIL, "testUser", "Test", "User");
      this.currentUser.photoUrl = "/avatar.png";
      this.currentUser.providerId = "test";
      this.currentUser.status = "approved";
      document.dispatchEvent(new Event('userUpdated'));

      fetch("/api/config").then((response) => {
        return response.json();
      }).then((result: Config) => {
        this.config = result as Config;
        document.dispatchEvent(new Event('configUpdated'));
      });
    }
  }

  LoadUser(email: string) {
    if (this.currentUser) {
      this.currentUser.email = email;
    }
  }

  GetSheetConfig(name: string, headers: string[]): DataConfig | undefined {
    if (this.sheetConfig[name])
      return this.sheetConfig[name];
    else {
      const dataConfig = this.config?.data.find(sheet => sheet.name === name);
      if (dataConfig) {
        if (!dataConfig.tagIndexes) dataConfig.tagIndexes = {};
        if (!dataConfig.fieldIndexes) dataConfig.fieldIndexes = {};
        headers.forEach((header, i) => {
          const fieldConfig = dataConfig.fields.find(field => field.id === header);
          if (fieldConfig) {
            fieldConfig.tags.forEach((tag) => {
              dataConfig.tagIndexes[tag] = i;
            });
          }
          dataConfig.fieldIndexes[header] = i;
        });

        this.sheetConfig[name] = dataConfig;
      }

      return dataConfig;
    }
  }

  GetRowConfig(sheetConfig: DataConfig, row: string[]): RowConfig {
    const result: RowConfig = new RowConfig();

    for (const [key, value] of Object.entries(sheetConfig.tagIndexes)) {
      result.tags[key] = row[value];
      if (key === "id") result.id = row[value];
      if (key === "name") result.name = row[value];
    }

    result.row = row;

    return result;
  }

  LoadData(name: string): Promise<{headers: string[], rows: string[][]}> {
    return new Promise<{headers: string[], rows: string[][]}>((resolve) => {
      if (!this.data[name]) {
        let url = '/api/data/' + name;
        if (PUBLIC_TEST_MODE === 'true') url = '/sample-data.local.json';
        fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((result: {headers: string[], rows: string[][]}) => {
          //console.log(JSON.stringify(result));
          this.data[name] = result;
          resolve(result);
        });
      }
      else {
        resolve(this.data[name]);
      }
    });
  }

  ShowSnackbar(message: string) {
    const x = document.getElementById("snackbar");
    if (x) {
      x.innerHTML = message;
      x.className = "show";
    }
    
    setTimeout(function(){ if (x) {
      x.className = x.className.replace("show", ""); 
    }}, 3000);
  }
}

export const appService: AppService = new AppService();
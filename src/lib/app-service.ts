import { Config, DataConfig, RowConfig, User } from "./interfaces";
import { browser } from '$app/environment';
import { PUBLIC_TEST_MODE, PUBLIC_TEST_EMAIL } from '$env/static/public';
import { Utilities, utils } from "./utilities";

export class AppService {
  tempFirstName: string = "";
  tempLastName: string = "";
  siteName: string = "Apigee Assets";

  currentUser: User | undefined = undefined;
  currentUserLoaded: boolean = false;
  reloadFlag: boolean = false;
  data: {[key: string]: {headers: string[], rows: string[][]}} = {};
  testMode: boolean = true;
  
  setHeaderAction: (buttonText: string) => void = (fds: string) => {
    console.log(fds);
  };

  constructor() {
    if (!this.siteName) this.siteName = "Data Marketplace";

    if (browser) {
      document.title = this.siteName;
      this.currentUser = new User(PUBLIC_TEST_EMAIL, "testUser", "Test", "User");
      this.currentUser.photoUrl = "/avatar.png";
      this.currentUser.providerId = "test";
      this.currentUser.status = "approved";
      document.dispatchEvent(new Event('userUpdated'));

      // Load config
      fetch("/api/config").then((response) => {
        return response.json();
      }).then((result: Config) => {
        // this.config = result as Config;
        utils.config = result;
        document.dispatchEvent(new Event('configUpdated'));
      });
    }
  }

  SetHeaderAction(buttonText: string) {
    this.setHeaderAction(buttonText);
  }

  LoadUser(email: string) {
    if (this.currentUser) {
      this.currentUser.email = email;
    }
  }

  GetSheetConfig(name: string, headers: string[]): DataConfig | undefined {
    return utils.GetSheetConfig(name, headers);
  }

  GetRowConfig(sheetConfig: DataConfig, headers: string[], row: string[] | undefined = undefined): RowConfig {
    const result: RowConfig = new RowConfig();

    if (!row) {
      result.row = Array(headers.length - 1).fill("");

      // Fill any initial values
      sheetConfig.fields.forEach((field) => {
        if (field.initialValue) {
          const rowIndex = headers.indexOf(field.id);
          if (field.initialValue === "CURRENT_USER" && this.currentUser)
            result.row[rowIndex] = this.currentUser.email;
          else if (field.initialValue === "TODAY") {
            const startDate = new Date();
            const startDateString: string = (startDate.getMonth() + 1).toString() + "/" + startDate.getDate().toString() + "/" + startDate.getFullYear().toString();
            result.row[rowIndex] = startDateString;
          }
          else
            result.row[rowIndex] = field.initialValue;
        }
      });
    }
    else {
      result.row = row;
    }

    for (const [key, value] of Object.entries(sheetConfig.tagIndexes)) {
      value.forEach(index => {
        if (result.tags[key])
          result.tags[key] += " - " + result.row[index];
        else
          result.tags[key] = result.row[index];

        if (key === "id") 
          result.id = result.row[index];
        else if (key === "name") 
          result.name = result.row[index];
        else if (key === "audience") 
          result.audience = result.row[index];
        else if (key === "description") {
          if (result.description)
            result.description += " - " + result.row[index];
          else
            result.description = result.row[index];
        }
        else if (key === "date") 
          result.date = result.row[index];
        else if (key === "level" && result.row[index]) {
          result.levels = result.row[index].split(",").map(item => {
            return item.trim();
          });
        }
        else if (key === "link") {
          let tempLink = result.row[index];
          if (tempLink && tempLink.length > 0) {
            result.links = result.links.concat(tempLink.split(",").map(link => {
              return link.trim();
            }));
          }
        }
        else if (key === "likes" && result.row[index]) {
          result.likes = result.row[index].split(",").map(item => {
            return item.trim();
          });
        }
        else if (key === "category" && result.row[index]) {
          result.categories = result.row[index].split(",").map(item => {
            return item.trim();
          });
        }
        else if (key === "type" && result.row[index]) {
          result.types = result.row[index].split(",").map(item => {
            return item.trim();
          });
        }
        else if (key === "topic" && result.row[index]) {
          result.topics = result.row[index].split(",").map(item => {
            return item.trim();
          });
        }
      });
    }

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
          // console.log(JSON.stringify(result));
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
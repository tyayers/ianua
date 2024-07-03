import type { Config, DataConfig } from "./interfaces";

export class Utilities {

  config: Config | undefined = undefined;
  sheetConfig: {[key: string]: DataConfig | undefined} = {};

  GetSheetConfig(name: string, headers: string[] = []): DataConfig | undefined {
    let dataConfig: DataConfig | undefined = undefined;
    
    if (!this.sheetConfig[name]) {
      dataConfig = this.config?.data.find(item => item.name === name);
    }
    else
      dataConfig = this.sheetConfig[name];
    
    if (dataConfig) {
      if (!dataConfig.tagIndexes) dataConfig.tagIndexes = {};
      if (!dataConfig.fieldIndexes) dataConfig.fieldIndexes = {};
      if (!dataConfig.relatedFields) dataConfig.relatedFields = [];
      // index tags
      headers.forEach((header, i) => {
        const fieldConfig = dataConfig.fields.find(field => field.id === header);
        if (fieldConfig && fieldConfig.tags) {
          fieldConfig.tags.forEach((tag) => {
            if (!dataConfig.tagIndexes[tag]) dataConfig.tagIndexes[tag] = [];
            dataConfig.tagIndexes[tag].push(i);
          });
        }
        dataConfig.fieldIndexes[header] = i;
      });

      // check related
      dataConfig.fields.forEach((field) => {
        if (field.type === "related") {
          dataConfig.relatedFields.push(field.relatedKey);
        }
      });

      // Only save it if we have headers with tag information saved
      if (headers.length > 0)
        this.sheetConfig[name] = dataConfig;
    }

    return dataConfig;
  }
}

export const utils: Utilities = new Utilities();
import type { Config, DataConfig } from "./interfaces";

export class ServerUtils {

  config: Config | undefined = undefined;

  GetSheetConfig(name: string): DataConfig | undefined {
    let result: DataConfig | undefined = undefined;
    if (this.config)  {
      result = this.config.data.find(item => item.name === name);
    }
    
    return result;
  }
}

export const serverUtils: ServerUtils = new ServerUtils();
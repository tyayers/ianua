class ServerUtils {
  config = void 0;
  GetSheetConfig(name) {
    let result = void 0;
    if (this.config) {
      result = this.config.data.find((item) => item.name === name);
    }
    return result;
  }
}
const serverUtils = new ServerUtils();
export {
  serverUtils as s
};

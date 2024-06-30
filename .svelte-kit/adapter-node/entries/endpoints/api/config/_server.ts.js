import { j as json } from "../../../../chunks/index.js";
import { parse } from "yaml";
const GET = async (event) => {
  const configString = await (await event.fetch("/config.yaml")).text();
  const config = parse(configString);
  return json(config);
};
export {
  GET
};

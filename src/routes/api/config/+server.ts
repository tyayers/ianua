import { json, type RequestHandler } from "@sveltejs/kit";
import { parse } from 'yaml'

export const GET: RequestHandler = async (event) => {

  const configString: string = await (await event.fetch("/config.yaml")).text();
  const config = parse(configString);

  return json(config);
} 
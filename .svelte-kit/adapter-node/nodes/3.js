import * as server from '../entries/pages/_name_/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_name_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/[name]/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.BaxYc1oB.js","_app/immutable/chunks/scheduler.Dqz8o37y.js","_app/immutable/chunks/index.Cr-v4LAJ.js","_app/immutable/chunks/components.header.DVQm-n5C.js","_app/immutable/chunks/entry.BmrUlgo1.js","_app/immutable/chunks/control.CYgJF_JY.js"];
export const stylesheets = ["_app/immutable/assets/3.w8SBNddZ.css","_app/immutable/assets/components.BDuNATEe.css"];
export const fonts = [];

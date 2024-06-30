import * as universal from '../entries/pages/_name_/_id_/_page.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_name_/_id_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/[name]/[id]/+page.ts";
export const imports = ["_app/immutable/nodes/4.YpEEhx_N.js","_app/immutable/chunks/scheduler.Dqz8o37y.js","_app/immutable/chunks/index.Cr-v4LAJ.js","_app/immutable/chunks/components.header.DVQm-n5C.js","_app/immutable/chunks/entry.BmrUlgo1.js","_app/immutable/chunks/control.CYgJF_JY.js","_app/immutable/chunks/components.row.edit.BVImyfRB.js"];
export const stylesheets = ["_app/immutable/assets/4.CAjgYzJQ.css","_app/immutable/assets/components.BDuNATEe.css","_app/immutable/assets/components.row.CME8qIRJ.css"];
export const fonts = [];

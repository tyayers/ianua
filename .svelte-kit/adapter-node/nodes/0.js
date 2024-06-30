

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CNpFBTNk.js","_app/immutable/chunks/scheduler.Dqz8o37y.js","_app/immutable/chunks/index.Cr-v4LAJ.js"];
export const stylesheets = ["_app/immutable/assets/0.DY41ksTa.css"];
export const fonts = [];

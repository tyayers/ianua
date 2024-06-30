export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["aip.png","apigee-logo-colorful.png","apigee.svg","avatar.png","check.svg","config.yaml","data_icon.png","docs.svg","gcloud.png","github.png","kubernetes.png","loop.svg","sample-data.local.json","slides.svg","youtube.png","youtube.webp"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".yaml":"text/yaml",".json":"application/json",".webp":"image/webp"},
	_: {
		client: {"start":"_app/immutable/entry/start.ljhqJQuJ.js","app":"_app/immutable/entry/app.CUL_V5wM.js","imports":["_app/immutable/entry/start.ljhqJQuJ.js","_app/immutable/chunks/entry.BmrUlgo1.js","_app/immutable/chunks/scheduler.Dqz8o37y.js","_app/immutable/chunks/control.CYgJF_JY.js","_app/immutable/entry/app.CUL_V5wM.js","_app/immutable/chunks/scheduler.Dqz8o37y.js","_app/immutable/chunks/index.Cr-v4LAJ.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/config",
				pattern: /^\/api\/config\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/config/_server.ts.js'))
			},
			{
				id: "/api/data/[name]",
				pattern: /^\/api\/data\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/data/_name_/_server.ts.js'))
			},
			{
				id: "/api/data/[name]/schema",
				pattern: /^\/api\/data\/([^/]+?)\/schema\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/data/_name_/schema/_server.ts.js'))
			},
			{
				id: "/api/data/[name]/usage",
				pattern: /^\/api\/data\/([^/]+?)\/usage\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/data/_name_/usage/_server.ts.js'))
			},
			{
				id: "/api/data/[name]/[id]",
				pattern: /^\/api\/data\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/data/_name_/_id_/_server.ts.js'))
			},
			{
				id: "/api/data/[name]/[id]/likes",
				pattern: /^\/api\/data\/([^/]+?)\/([^/]+?)\/likes\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/data/_name_/_id_/likes/_server.ts.js'))
			},
			{
				id: "/api/users",
				pattern: /^\/api\/users\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/users/_server.ts.js'))
			},
			{
				id: "/[name]",
				pattern: /^\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/[name]/new",
				pattern: /^\/([^/]+?)\/new\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/[name]/[id]",
				pattern: /^\/([^/]+?)\/([^/]+?)\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/[name]/[id]/edit",
				pattern: /^\/([^/]+?)\/([^/]+?)\/edit\/?$/,
				params: [{"name":"name","optional":false,"rest":false,"chained":false},{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

export const prerendered = new Set([]);

export const base = "";
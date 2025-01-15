
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const npm_package_exports___node_polyfills_types: string;
	export const AUTOJUMP_ERROR_PATH: string;
	export const npm_config_prefer_workspace_packages: string;
	export const COREPACK_ROOT: string;
	export const STARSHIP_SHELL: string;
	export const npm_package_scripts_test_cross_platform_build: string;
	export const npm_package_exports___vite_import: string;
	export const npm_package_exports___hooks_import: string;
	export const TERM_PROGRAM: string;
	export const NODE: string;
	export const npm_package_dependencies_sade: string;
	export const FNM_LOGLEVEL: string;
	export const INIT_CWD: string;
	export const npm_package_devDependencies_typescript: string;
	export const npm_package_homepage: string;
	export const AUTOJUMP_SOURCED: string;
	export const npm_package_devDependencies_vite: string;
	export const WARP_HONOR_PS1: string;
	export const TERM: string;
	export const SHELL: string;
	export const npm_package_dependencies_devalue: string;
	export const FNM_NODE_DIST_MIRROR: string;
	export const HOMEBREW_REPOSITORY: string;
	export const TMPDIR: string;
	export const npm_package_scripts_lint: string;
	export const npm_package_dependencies_set_cookie_parser: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_dependencies_cookie: string;
	export const FPATH: string;
	export const npm_config_registry: string;
	export const npm_package_devDependencies_svelte_preprocess: string;
	export const npm_package_dependencies_import_meta_resolve: string;
	export const npm_package_repository_url: string;
	export const LC_ALL: string;
	export const PNPM_HOME: string;
	export const FNM_COREPACK_ENABLED: string;
	export const npm_package_exports___node_import: string;
	export const npm_package_description: string;
	export const ZAP_PLUGIN_DIR: string;
	export const PYTHONIOENCODING: string;
	export const USER: string;
	export const npm_package_exports___package_json: string;
	export const npm_package_dependencies_esm_env: string;
	export const npm_package_license: string;
	export const PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: string;
	export const COMMAND_MODE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_package_exports___import: string;
	export const npm_package_repository_directory: string;
	export const PUPPETEER_EXECUTABLE_PATH: string;
	export const SSH_AUTH_SOCK: string;
	export const npm_package_bin_svelte_kit: string;
	export const __CF_USER_TEXT_ENCODING: string;
	export const WARP_IS_LOCAL_SHELL_SESSION: string;
	export const npm_execpath: string;
	export const npm_config_save_workspace_protocol: string;
	export const npm_package_peerDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_devDependencies_svelte: string;
	export const TAURI_SIGNING_PRIVATE_KEY: string;
	export const WARP_USE_SSH_WRAPPER: string;
	export const npm_config_frozen_lockfile: string;
	export const FNM_VERSION_FILE_STRATEGY: string;
	export const FNM_ARCH: string;
	export const npm_package_scripts_postinstall: string;
	export const PATH: string;
	export const npm_package_devDependencies_rollup: string;
	export const npm_package_dependencies_magic_string: string;
	export const ZSHRC: string;
	export const _: string;
	export const LaunchInstanceID: string;
	export const npm_package_keywords_4: string;
	export const COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
	export const __CFBundleIdentifier: string;
	export const npm_command: string;
	export const PWD: string;
	export const npm_package_bugs_url: string;
	export const FZF_ALT_C_COMMAND: string;
	export const npm_lifecycle_event: string;
	export const EDITOR: string;
	export const npm_package_types: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_repository_type: string;
	export const npm_package_keywords_0: string;
	export const npm_package_name: string;
	export const LANG: string;
	export const npm_package_scripts_generate_types: string;
	export const npm_package_scripts_test_integration: string;
	export const npm_package_devDependencies__types_connect: string;
	export const npm_package_keywords_1: string;
	export const npm_package_exports___node_polyfills_import: string;
	export const npm_package_exports___types: string;
	export const npm_package_keywords_2: string;
	export const npm_package_scripts_test_cross_platform_dev: string;
	export const npm_package_devDependencies_vitest: string;
	export const npm_package_keywords_3: string;
	export const FNM_MULTISHELL_PATH: string;
	export const XPC_FLAGS: string;
	export const npm_package_dependencies_tiny_glob: string;
	export const npm_package_engines_node: string;
	export const npm_package_dependencies_sirv: string;
	export const npm_config_node_gyp: string;
	export const npm_package_version: string;
	export const XPC_SERVICE_NAME: string;
	export const YSU_VERSION: string;
	export const npm_package_type: string;
	export const SHLVL: string;
	export const HOME: string;
	export const npm_package_scripts_generate_version: string;
	export const npm_package_scripts_test: string;
	export const npm_package_scripts_check_all: string;
	export const npm_package_exports___vite_types: string;
	export const npm_package_exports___hooks_types: string;
	export const TAURI_SIGNING_PRIVATE_KEY_PASSWORD: string;
	export const HOMEBREW_PREFIX: string;
	export const FNM_DIR: string;
	export const npm_package_scripts_format: string;
	export const npm_package_peerDependencies_vite: string;
	export const STARSHIP_SESSION_KEY: string;
	export const LOGNAME: string;
	export const npm_lifecycle_script: string;
	export const npm_package_peerDependencies_svelte: string;
	export const ZAP_DIR: string;
	export const FZF_CTRL_T_COMMAND: string;
	export const npm_config_shared_workspace_lockfile: string;
	export const npm_package_devDependencies__types_set_cookie_parser: string;
	export const FZF_DEFAULT_COMMAND: string;
	export const SSH_SOCKET_DIR: string;
	export const BUN_INSTALL: string;
	export const npm_config_user_agent: string;
	export const npm_package_files_3: string;
	export const npm_package_dependencies__types_cookie: string;
	export const FNM_RESOLVE_ENGINES: string;
	export const npm_package_files_2: string;
	export const npm_package_devDependencies__types_node: string;
	export const npm_package_devDependencies__playwright_test: string;
	export const INFOPATH: string;
	export const HOMEBREW_CELLAR: string;
	export const npm_package_files_1: string;
	export const npm_package_devDependencies_dts_buddy: string;
	export const npm_config_link_workspace_packages: string;
	export const npm_package_files_0: string;
	export const npm_package_dependencies_mrmime: string;
	export const npm_package_dependencies_kleur: string;
	export const CONDA_CHANGEPS1: string;
	export const npm_package_exports___node_types: string;
	export const npm_package_files_6: string;
	export const SECURITYSESSIONID: string;
	export const npm_package_scripts_check: string;
	export const npm_package_files_5: string;
	export const npm_node_execpath: string;
	export const npm_package_scripts_test_unit: string;
	export const npm_package_files_4: string;
	export const COLORTERM: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		npm_package_exports___node_polyfills_types: string;
		AUTOJUMP_ERROR_PATH: string;
		npm_config_prefer_workspace_packages: string;
		COREPACK_ROOT: string;
		STARSHIP_SHELL: string;
		npm_package_scripts_test_cross_platform_build: string;
		npm_package_exports___vite_import: string;
		npm_package_exports___hooks_import: string;
		TERM_PROGRAM: string;
		NODE: string;
		npm_package_dependencies_sade: string;
		FNM_LOGLEVEL: string;
		INIT_CWD: string;
		npm_package_devDependencies_typescript: string;
		npm_package_homepage: string;
		AUTOJUMP_SOURCED: string;
		npm_package_devDependencies_vite: string;
		WARP_HONOR_PS1: string;
		TERM: string;
		SHELL: string;
		npm_package_dependencies_devalue: string;
		FNM_NODE_DIST_MIRROR: string;
		HOMEBREW_REPOSITORY: string;
		TMPDIR: string;
		npm_package_scripts_lint: string;
		npm_package_dependencies_set_cookie_parser: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_dependencies_cookie: string;
		FPATH: string;
		npm_config_registry: string;
		npm_package_devDependencies_svelte_preprocess: string;
		npm_package_dependencies_import_meta_resolve: string;
		npm_package_repository_url: string;
		LC_ALL: string;
		PNPM_HOME: string;
		FNM_COREPACK_ENABLED: string;
		npm_package_exports___node_import: string;
		npm_package_description: string;
		ZAP_PLUGIN_DIR: string;
		PYTHONIOENCODING: string;
		USER: string;
		npm_package_exports___package_json: string;
		npm_package_dependencies_esm_env: string;
		npm_package_license: string;
		PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: string;
		COMMAND_MODE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_package_exports___import: string;
		npm_package_repository_directory: string;
		PUPPETEER_EXECUTABLE_PATH: string;
		SSH_AUTH_SOCK: string;
		npm_package_bin_svelte_kit: string;
		__CF_USER_TEXT_ENCODING: string;
		WARP_IS_LOCAL_SHELL_SESSION: string;
		npm_execpath: string;
		npm_config_save_workspace_protocol: string;
		npm_package_peerDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_devDependencies_svelte: string;
		TAURI_SIGNING_PRIVATE_KEY: string;
		WARP_USE_SSH_WRAPPER: string;
		npm_config_frozen_lockfile: string;
		FNM_VERSION_FILE_STRATEGY: string;
		FNM_ARCH: string;
		npm_package_scripts_postinstall: string;
		PATH: string;
		npm_package_devDependencies_rollup: string;
		npm_package_dependencies_magic_string: string;
		ZSHRC: string;
		_: string;
		LaunchInstanceID: string;
		npm_package_keywords_4: string;
		COREPACK_ENABLE_DOWNLOAD_PROMPT: string;
		__CFBundleIdentifier: string;
		npm_command: string;
		PWD: string;
		npm_package_bugs_url: string;
		FZF_ALT_C_COMMAND: string;
		npm_lifecycle_event: string;
		EDITOR: string;
		npm_package_types: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_repository_type: string;
		npm_package_keywords_0: string;
		npm_package_name: string;
		LANG: string;
		npm_package_scripts_generate_types: string;
		npm_package_scripts_test_integration: string;
		npm_package_devDependencies__types_connect: string;
		npm_package_keywords_1: string;
		npm_package_exports___node_polyfills_import: string;
		npm_package_exports___types: string;
		npm_package_keywords_2: string;
		npm_package_scripts_test_cross_platform_dev: string;
		npm_package_devDependencies_vitest: string;
		npm_package_keywords_3: string;
		FNM_MULTISHELL_PATH: string;
		XPC_FLAGS: string;
		npm_package_dependencies_tiny_glob: string;
		npm_package_engines_node: string;
		npm_package_dependencies_sirv: string;
		npm_config_node_gyp: string;
		npm_package_version: string;
		XPC_SERVICE_NAME: string;
		YSU_VERSION: string;
		npm_package_type: string;
		SHLVL: string;
		HOME: string;
		npm_package_scripts_generate_version: string;
		npm_package_scripts_test: string;
		npm_package_scripts_check_all: string;
		npm_package_exports___vite_types: string;
		npm_package_exports___hooks_types: string;
		TAURI_SIGNING_PRIVATE_KEY_PASSWORD: string;
		HOMEBREW_PREFIX: string;
		FNM_DIR: string;
		npm_package_scripts_format: string;
		npm_package_peerDependencies_vite: string;
		STARSHIP_SESSION_KEY: string;
		LOGNAME: string;
		npm_lifecycle_script: string;
		npm_package_peerDependencies_svelte: string;
		ZAP_DIR: string;
		FZF_CTRL_T_COMMAND: string;
		npm_config_shared_workspace_lockfile: string;
		npm_package_devDependencies__types_set_cookie_parser: string;
		FZF_DEFAULT_COMMAND: string;
		SSH_SOCKET_DIR: string;
		BUN_INSTALL: string;
		npm_config_user_agent: string;
		npm_package_files_3: string;
		npm_package_dependencies__types_cookie: string;
		FNM_RESOLVE_ENGINES: string;
		npm_package_files_2: string;
		npm_package_devDependencies__types_node: string;
		npm_package_devDependencies__playwright_test: string;
		INFOPATH: string;
		HOMEBREW_CELLAR: string;
		npm_package_files_1: string;
		npm_package_devDependencies_dts_buddy: string;
		npm_config_link_workspace_packages: string;
		npm_package_files_0: string;
		npm_package_dependencies_mrmime: string;
		npm_package_dependencies_kleur: string;
		CONDA_CHANGEPS1: string;
		npm_package_exports___node_types: string;
		npm_package_files_6: string;
		SECURITYSESSIONID: string;
		npm_package_scripts_check: string;
		npm_package_files_5: string;
		npm_node_execpath: string;
		npm_package_scripts_test_unit: string;
		npm_package_files_4: string;
		COLORTERM: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}

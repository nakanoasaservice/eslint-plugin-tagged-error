import { noDuplicateTags } from "./rules/no-duplicate-tags";

const rules = {
	"no-duplicate-tags": noDuplicateTags,
};

/**
 * Recommended config for ESLint Flat Config.
 *
 * Example:
 *   import taggedError from "@nakanoaas/eslint-plugin-tagged-error";
 *   export default [taggedError.configs.recommended];
 */
const configs = {
	recommended: {
		plugins: {
			"tagged-error": { rules },
		},
		rules: {
			"tagged-error/no-duplicate-tags": "error",
		},
	},
} as const;

const plugin = { rules, configs } as const;

export default plugin;

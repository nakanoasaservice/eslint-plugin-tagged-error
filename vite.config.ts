import { readFile, writeFile } from "node:fs/promises";
import { defineConfig } from "vite-plus";
export default defineConfig({
	fmt: { useTabs: true, ignorePatterns: ["dist/**", "jsr.jsonc", "pnpm-lock.yaml"] },
	lint: {
		rules: { "typescript/no-non-null-assertion": "warn" },
		options: { typeAware: true, typeCheck: true },
		ignorePatterns: ["dist/**"],
	},
	pack: {
		deps: {
			// tsdown <0.23 compatibility: resolve external dependency subpaths.
			// Remove to preserve subpath imports as written (the new default).
			// https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
			resolveDepSubpath: true,
		},
		entry: "src/index.ts",
		format: ["cjs", "esm"],
		unbundle: true,
		exports: true,
		dts: true,
		sourcemap: true,
		clean: true,
		hooks: {
			"build:done": async () => {
				const packageJson = JSON.parse(await readFile("package.json", "utf-8")) as {
					name: string;
					version: string;
					license: string;
					peerDependencies: {
						eslint: string;
					};
				};

				await writeFile(
					"jsr.jsonc",
					JSON.stringify(
						{
							name: packageJson.name,
							version: packageJson.version,
							license: packageJson.license,
							exports: "./src/index.ts",
							publish: {
								include: ["src", "README.md", "LICENSE"],
								exclude: ["**/*.test.ts", "test-utils.ts"],
							},
							imports: {
								eslint: `npm:eslint@${packageJson.peerDependencies.eslint}`,
							},
						},
						null,
						2,
					),
				);
			},
		},
	},
});

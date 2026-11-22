# @nakanoaas/eslint-plugin-tagged-error

[![npm version](https://img.shields.io/npm/v/%40nakanoaas%2Feslint-plugin-tagged-error)](https://www.npmjs.com/package/@nakanoaas/eslint-plugin-tagged-error) [![JSR](https://jsr.io/badges/@nakanoaas/eslint-plugin-tagged-error)](https://jsr.io/@nakanoaas/eslint-plugin-tagged-error)

ESLint plugin to check for duplicate `TaggedError` tags across the entire project.

## Installation

```bash
npm install --save-dev @nakanoaas/eslint-plugin-tagged-error
# or
pnpm add -D @nakanoaas/eslint-plugin-tagged-error
# or
yarn add -D @nakanoaas/eslint-plugin-tagged-error
```

## Usage

Add the plugin to your `eslint.config.js`:

```javascript
import taggedError from "@nakanoaas/eslint-plugin-tagged-error";

export default [taggedError.configs.recommended];
```

## Rules

### `no-duplicate-tags`

Checks for duplicate `TaggedError` tags across the entire project.

**Examples of incorrect code:**

```typescript
// file1.ts
import { TaggedError } from "@nakanoaas/tagged-error";

function error1() {
	return new TaggedError("DUPLICATE_TAG", { message: "Error 1" });
}
```

```typescript
// file2.ts
import { TaggedError } from "@nakanoaas/tagged-error";

function error2() {
	return new TaggedError("DUPLICATE_TAG", { message: "Error 2" });
}
```

**Examples of correct code:**

```typescript
// file1.ts
import { TaggedError } from "@nakanoaas/tagged-error";

function error1() {
	return new TaggedError("UNIQUE_TAG_1", { message: "Error 1" });
}
```

```typescript
// file2.ts
import { TaggedError } from "@nakanoaas/tagged-error";

function error2() {
	return new TaggedError("UNIQUE_TAG_2", { message: "Error 2" });
}
```

## License

ISC

## Development

Use Node.js 24 and the pnpm version pinned in `package.json`.
Run `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, and `pnpm build`.
Vite+ provides formatting, linting, type checks, tests and packaging. ESLint
remains a dependency because this package implements and tests an ESLint plugin.

Update Vite+ and its bundled tools together with `vp migrate`, then refresh the
pnpm lockfile. CI resolves the Vite+ version from the project dependency or catalog
automatically. Run the project's checks before committing toolchain updates.

### Runtime versions

`package.json` is the source of truth for development Node.js (`devEngines.runtime`)
and pnpm (`packageManager`). The major versions in `mise.toml` only bootstrap the
environment. Install the [global Vite+ CLI](https://viteplus.dev/guide/global-cli)
with environment management enabled, then use `vp install --frozen-lockfile`
and `vp run <script>` to run with the declared versions. `pnpm` commands also use
them when the Vite+ shims are active. The project-local CLI alone does not switch
Node.js versions.

CI reads the same manifest automatically; compatibility-test matrices explicitly
override Node.js. pnpm runtime management is disabled so it does not override
Vite+'s selection. Keep any consumer-facing `engines.node` support range separate
from the development pin.

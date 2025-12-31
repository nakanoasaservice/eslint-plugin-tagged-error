# @nakanoaas/eslint-plugin-tagged-error

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

export default [
  taggedError.configs.recommended,
];
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


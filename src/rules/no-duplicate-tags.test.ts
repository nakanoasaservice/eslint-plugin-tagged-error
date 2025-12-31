import { RuleTester } from "eslint";

import { globalTagMap, noDuplicateTags } from "./no-duplicate-tags.ts";

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2020,
		sourceType: "module",
	},
});

// Reset global map before each test suite
function resetGlobalMap() {
	globalTagMap.clear();
}

// Test: should pass when tags are unique
resetGlobalMap();
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [
		{
			code: 'new TaggedError("UNIQUE_TAG_1", { message: "Error 1" });',
			filename: "file1.ts",
		},
		{
			code: 'new TaggedError("UNIQUE_TAG_2", { message: "Error 2" });',
			filename: "file2.ts",
		},
	],
	invalid: [],
});

// Test: should detect duplicate tags across files
resetGlobalMap();
// First file - no error expected
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [
		{
			code: 'new TaggedError("DUPLICATE_TAG", { message: "Error 1" });',
			filename: "file1.ts",
		},
	],
	invalid: [],
});

// Second file - should detect duplicate
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [],
	invalid: [
		{
			code: 'new TaggedError("DUPLICATE_TAG", { message: "Error 2" });',
			filename: "file2.ts",
			errors: [
				{
					messageId: "duplicateTag",
				},
			],
		},
	],
});

// Test: should not report error for the first occurrence
resetGlobalMap();
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [
		{
			code: 'new TaggedError("FIRST_TAG", { message: "Error" });',
			filename: "file1.ts",
		},
	],
	invalid: [],
});

// Test: should detect multiple duplicates
resetGlobalMap();
// First file
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [
		{
			code: 'new TaggedError("MULTI_DUP", { message: "Error 1" });',
			filename: "file1.ts",
		},
	],
	invalid: [],
});

// Second file
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [],
	invalid: [
		{
			code: 'new TaggedError("MULTI_DUP", { message: "Error 2" });',
			filename: "file2.ts",
			errors: [
				{
					messageId: "duplicateTag",
				},
			],
		},
	],
});

// Third file - should detect duplicates from previous files
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [],
	invalid: [
		{
			code: 'new TaggedError("MULTI_DUP", { message: "Error 3" });',
			filename: "file3.ts",
			errors: [
				{
					messageId: "duplicateTag",
				},
			],
		},
	],
});

// Test: should ignore non-TaggedError constructors
resetGlobalMap();
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [
		{
			code: 'new Error("Some error");',
			filename: "file1.ts",
		},
		{
			code: 'new CustomError("TAG", { message: "Error" });',
			filename: "file2.ts",
		},
	],
	invalid: [],
});

// Test: should handle TaggedError with non-string tags
resetGlobalMap();
ruleTester.run("no-duplicate-tags", noDuplicateTags, {
	valid: [
		{
			code: 'new TaggedError(123, { message: "Error" });',
			filename: "file1.ts",
		},
		{
			code: 'new TaggedError(variable, { message: "Error" });',
			filename: "file2.ts",
		},
	],
	invalid: [],
});

import type { Rule } from "eslint";
import type * as estree from "estree";

// Global map to track tags across the entire project
export const globalTagMap = new Map<
	string,
	Array<{ file: string; line: number; column: number }>
>();

/**
 * Extracts the tag from a TaggedError new call
 */
function extractTagFromCall(node: estree.NewExpression): string | null {
	// Check for new TaggedError("TAG", ...) format
	if (node.arguments.length === 0) {
		return null;
	}

	// Check if it's TaggedError
	let isTaggedError = false;
	if (node.callee.type === "Identifier") {
		isTaggedError = node.callee.name === "TaggedError";
	} else if (node.callee.type === "MemberExpression") {
		// Also detect when imported from @nakanoaas/tagged-error
		if (
			node.callee.property.type === "Identifier" &&
			node.callee.property.name === "TaggedError"
		) {
			isTaggedError = true;
		}
	}

	if (!isTaggedError) {
		return null;
	}

	const firstArg = node.arguments[0];
	if (
		firstArg &&
		firstArg.type === "Literal" &&
		typeof firstArg.value === "string"
	) {
		return firstArg.value;
	}

	return null;
}

export const noDuplicateTags: Rule.RuleModule = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Check for duplicate TaggedError tags across the entire project",
			category: "Possible Errors",
			recommended: true,
		},
		messages: {
			duplicateTag:
				"TaggedError tag '{{tag}}' is duplicated. It is also used in other files: {{locations}}",
		},
		schema: [],
	},
	create(context: Rule.RuleContext): Rule.RuleListener {
		const filename = context.filename;

		return {
			NewExpression(node: estree.Node) {
				const newNode = node as estree.NewExpression;
				const tag = extractTagFromCall(newNode);

				if (!tag) {
					return;
				}

				const line = newNode.loc?.start.line ?? 0;
				const column = newNode.loc?.start.column ?? 0;

				// Add to global map
				if (!globalTagMap.has(tag)) {
					globalTagMap.set(tag, []);
				}

				// biome-ignore lint/style/noNonNullAssertion: We know the tag is in the map
				const locations = globalTagMap.get(tag)!;
				const currentLocation = { file: filename, line, column };

				// Check if already registered at the same location in the same file
				const isDuplicate = locations.some(
					(loc) =>
						loc.file === filename && loc.line === line && loc.column === column,
				);

				if (!isDuplicate) {
					locations.push(currentLocation);
				}

				// Check if the same tag is used in other files
				const otherLocations = locations.filter(
					(loc) =>
						loc.file !== filename || loc.line !== line || loc.column !== column,
				);

				if (otherLocations.length > 0) {
					const locationStrings = otherLocations
						.map((loc) => `${loc.file}:${loc.line}:${loc.column}`)
						.join(", ");

					context.report({
						node: newNode,
						messageId: "duplicateTag",
						data: {
							tag,
							locations: locationStrings,
						},
					});
				}
			},
		};
	},
};

import { getTestFilePath } from "../../fileUtils";
import path from "path";

describe("getTestFilePath", () => {
	it("replaces .ts extension with .test.ts in the test file path", () => {
		const filePath = "client/components/Component.ts";
		const rootDir = "client";
		const expected = path.join(
			"client",
			"__tests__",
			"components",
			"Component.test.ts",
		);

		expect(getTestFilePath(filePath, rootDir)).toBe(expected);
	});

	it("replaces .tsx extension with .test.tsx in the test file path", () => {
		const filePath = "client/components/Component.tsx";
		const rootDir = "client";
		const expected = path.join(
			"client",
			"__tests__",
			"components",
			"Component.test.tsx",
		);

		expect(getTestFilePath(filePath, rootDir)).toBe(expected);
	});

	it("handles different root directories correctly", () => {
		const filePath = "src/components/Component.ts";
		const rootDir = "src";
		const expected = path.join(
			"src",
			"__tests__",
			"components",
			"Component.test.ts",
		);

		expect(getTestFilePath(filePath, rootDir)).toBe(expected);
	});

	it("handles nested file paths correctly", () => {
		const filePath = "client/components/subcomponents/Component.ts";
		const rootDir = "client";
		const expected = path.join(
			"client",
			"__tests__",
			"components",
			"subcomponents",
			"Component.test.ts",
		);

		expect(getTestFilePath(filePath, rootDir)).toBe(expected);
	});

	// Additional tests can be added here as needed.
});

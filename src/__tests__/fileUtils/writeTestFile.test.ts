// import mockFs from "mock-fs";
import fs from "fs";
import path from "path";
import { writeTestFile, getTestFilePath } from "../../fileUtils";

jest.mock("fs");

describe("writeTestFile", () => {
	it("writes content to the correct test file path", () => {
		const filePath = "src/components/Component.ts";
		const content = "test content";
		const rootDir = "src";
		const testFilePath = getTestFilePath(filePath, rootDir);

		writeTestFile(filePath, content, rootDir);

		expect(fs.writeFileSync).toHaveBeenCalledWith(testFilePath, content);
	});

	it("creates the necessary directories for the test file", () => {
		const filePath = "src/components/Component.ts";
		const content = "test content";
		const rootDir = "src";
		const testFilePath = getTestFilePath(filePath, rootDir);
		const directoryPath = path.dirname(testFilePath);

		writeTestFile(filePath, content, rootDir);

		expect(fs.mkdirSync).toHaveBeenCalledWith(directoryPath, {
			recursive: true,
		});
	});

	// it("overwrites an existing file with new content", () => {
	// 	const filePath = "src/components/Component.ts";
	// 	const content = "new test content";
	// 	const rootDir = "src";
	// 	const testFilePath = getTestFilePath(filePath, rootDir);

	// 	// Creating a mock existing file
	// 	mockFs({
	// 		[testFilePath]: "old test content",
	// 	});

	// 	writeTestFile(filePath, content, rootDir);

	// 	const updatedContent = fs.readFileSync(testFilePath, "utf8");
	// 	expect(updatedContent).toBe(content);
	// });

	// Additional tests can be added here as needed.
});

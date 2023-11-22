import mockFs from "mock-fs";
import { findTypescriptFiles } from "../../fileUtils";
import { IFileData } from "../../types/interfaces";

describe("findTypescriptFiles", () => {
	afterEach(() => {
		mockFs.restore();
	});

	it("returns TypeScript files in a directory", () => {
		mockFs({
			"some/dir": {
				"file1.ts": "content of file1",
				"file2.ts": "content of file2",
			},
		});

		const expected: IFileData[] = [
			{ filePath: "some/dir/file1.ts", content: "content of file1" },
			{ filePath: "some/dir/file2.ts", content: "content of file2" },
		];

		expect(findTypescriptFiles("some/dir")).toEqual(expected);
	});

	it("ignores non-TypeScript files", () => {
		mockFs({
			"mixed/dir": {
				"file1.ts": "TS file",
				"file2.js": "JS file",
				"file3.txt": "Text file",
			},
		});

		const expected: IFileData[] = [
			{ filePath: "mixed/dir/file1.ts", content: "TS file" },
		];

		expect(findTypescriptFiles("mixed/dir")).toEqual(expected);
	});

	it("handles nested directories", () => {
		mockFs({
			"nested/dir": {
				"file1.ts": "root TS file",
				subdir: {
					"file2.ts": "nested TS file",
				},
			},
		});

		const expected: IFileData[] = [
			{ filePath: "nested/dir/file1.ts", content: "root TS file" },
			{ filePath: "nested/dir/subdir/file2.ts", content: "nested TS file" },
		];

		expect(findTypescriptFiles("nested/dir")).toEqual(expected);
	});

	it("returns an empty array for empty directories", () => {
		mockFs({
			"empty/dir": {},
		});

		expect(findTypescriptFiles("empty/dir")).toEqual([]);
	});

	it("correctly handles files with special characters in names", () => {
		mockFs({
			"special/dir": {
				"file@1.ts": "content of file@1",
				"file#2.ts": "content of file#2",
			},
		});

		const expected: IFileData[] = [
			{ filePath: "special/dir/file@1.ts", content: "content of file@1" },
			{ filePath: "special/dir/file#2.ts", content: "content of file#2" },
		].sort((a, b) => a.filePath.localeCompare(b.filePath));

		const result = findTypescriptFiles("special/dir").sort((a, b) =>
			a.filePath.localeCompare(b.filePath),
		);

		expect(result).toEqual(expected);
	});

	// Additional tests can be added here as needed.
});

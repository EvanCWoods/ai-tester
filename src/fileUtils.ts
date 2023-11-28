import fs from "fs";
import path from "path";
import { IFileData } from "./types/interfaces";

export const findTypescriptFiles = (
	dir: string,
	filelist: IFileData[] = [],
): IFileData[] => {
	if (dir.includes("node_modules") || dir.includes("__tests__")) {
		return filelist;
	}

	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filepath = path.join(dir, file);
		const stat = fs.statSync(filepath);

		if (stat.isDirectory()) {
			filelist = findTypescriptFiles(filepath, filelist);
		} else if (/\.(ts|tsx)$/.test(file)) {
			const content = fs.readFileSync(filepath, "utf8");
			filelist.push({ filePath: filepath, content });
		}
	});

	return filelist;
};

export const getTestFilePath = (filePath, rootDir, isSpecificFolder) => {
	// Extract the part of the filePath that is relative to the root directory
	const relativePath = path.relative(rootDir, filePath);

	// Replace the file extension with .test.ts or .test.tsx accordingly
	const testFileExtension = filePath.endsWith(".tsx")
		? ".test.tsx"
		: ".test.ts";
	const testFileName = relativePath.replace(/\.(tsx|ts)$/, testFileExtension);

	// If working with specific folders, adjust the path to place the __tests__ folder correctly
	if (isSpecificFolder) {
		const parts = relativePath.split(path.sep);
		parts.splice(1, 0, "__tests__"); // Insert '__tests__' after the first directory
		return path.join(rootDir, ...parts);
	}

	// If not working with specific folders, use the existing logic
	return path.join(rootDir, "__tests__", testFileName);
};

export const writeTestFile = (filePath, content, rootDir, isSpecificFolder) => {
	const testFilePath = getTestFilePath(filePath, rootDir, isSpecificFolder);
	console.log(`Writing test file to ${testFilePath}\n\n`);
	fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
	fs.writeFileSync(testFilePath, content);
};

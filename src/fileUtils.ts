#!/usr/bin/env node
import fs from "fs";
import path from "path";

interface FileData {
	filePath: string;
	content: string;
}

export const findTypescriptFiles = (
	dir: string,
	filelist: FileData[] = [],
): FileData[] => {
	if (dir.includes("node_modules")) {
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

export const getTestFilePath = (filePath: string): string => {
	const dirPath = path.dirname(filePath);
	const fileName = path.basename(filePath);
	const testFileName = fileName.replace(/\.(tsx|ts)$/, ".test.ts");
	const testDirPath = path.join(dirPath, "__tests__");
	return path.join(testDirPath, testFileName);
};

export const writeTestFile = (filePath: string, content: string): void => {
	const testFilePath = getTestFilePath(filePath);
	fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
	fs.writeFileSync(testFilePath, content);
};

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

export const getTestFilePath = (filePath: string, rootDir: string): string => {
	// Assuming all your TS/TSX files are under the rootDir (e.g., ./client)
	const relativePath = path.relative(rootDir, filePath);
	const testFileName = relativePath.replace(/\.(tsx|ts)$/, ".test.ts");

	// Assuming you want to place your tests under ./client/__tests__
	return path.join(rootDir, "__tests__", testFileName);
};

export const writeTestFile = (
	filePath: string,
	content: string,
	rootDir: string,
): void => {
	const testFilePath = getTestFilePath(filePath, rootDir);
	console.log(`Writing test file to ${testFilePath}`);
	fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
	fs.writeFileSync(testFilePath, content);
};

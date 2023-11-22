#!/usr/bin/env node
import path from "path";
import { findTypescriptFiles, writeTestFile } from "./fileUtils";
import { openAIService } from "./openAiService";
import { getUserInput } from "./getUserInput";

const main = async (): Promise<void> => {
	const { frontendDir, backendDir } = await getUserInput();
	const currentDir = process.cwd();
	const dirsToSearch: string[] = [
		path.join(currentDir, frontendDir),
		path.join(currentDir, backendDir),
	];

	let tsFiles: any = [];

	for (const dir of dirsToSearch) {
		tsFiles = tsFiles.concat(findTypescriptFiles(dir));
	}

	console.log(`Found ${tsFiles.length} TypeScript files.`);

	if (tsFiles.length > 0) {
		const firstFileContent = tsFiles[0].content;
		console.log(
			`Sending content of the ${tsFiles[0].filePath} file to OpenAI...`,
		);
		const response = await openAIService(
			`Please write a test suite in TypeScript using Jest for the following component. Only return the code, not any explanations or markdown. Here is the component code:\n\n${firstFileContent}`,
		);
		console.log(`Generated test suite for ${tsFiles[0].filePath}`);
		writeTestFile(tsFiles[0].filePath, response);
	} else {
		console.log("No TypeScript files found.");
	}
};

main();

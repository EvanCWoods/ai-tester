#!/usr/bin/env node
import path from "path";
import { findTypescriptFiles, writeTestFile } from "./fileUtils";
import { openAIService } from "./openAiService";
import { getUserInput } from "./getUserInput";
import findTestCommand from "./findTestCommand";

const main = async (): Promise<void> => {
	const { frontendDir, backendDir, openAiApiKey, openAiOrg } =
		await getUserInput();
	const { frontendTestCommand, backendTestCommand } = findTestCommand(
		frontendDir,
		backendDir,
	);
	console.log(frontendTestCommand, backendTestCommand);
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
		for (const file of tsFiles) {
			const fileContent = file.content;
			console.log(`Sending content of the ${file.filePath} file to OpenAI...`);

			// Determine the test command based on the file path
			const testCommand = file.filePath.includes("/client/")
				? frontendTestCommand
				: backendTestCommand;

			const response = await openAIService(
				`Please write a test suite in TypeScript for the following component with the ${testCommand} test command. Only return the code, not any explanations or markdown. Here is the component code:\n\n${fileContent}`,
				openAiApiKey,
				openAiOrg,
			);
			console.log(`Generated test suite for ${file.filePath}`);
			const rootDir = file.filePath.includes("/client/")
				? path.join(currentDir, frontendDir, "src") // Adjust this path as needed
				: path.join(currentDir, backendDir);
			console.log(`Generated test suite for ${file.filePath}`);
			writeTestFile(file.filePath, response, rootDir);
		}
	} else {
		console.log("No TypeScript files found.");
	}
};

main();

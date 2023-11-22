#!/usr/bin/env node
import path from "path";
import { findTypescriptFiles, writeTestFile } from "./fileUtils";
import { openAIService } from "./openAiService";
import { getUserInput } from "./getUserInput";
import findTestCommand from "./findTestCommand";

export const main = async (): Promise<void> => {
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
			console.log(
				`Sending content of the ${file.filePath} file to OpenAI...\n\n`,
			);

			// Determine the test command based on the file path
			const testCommand = file.filePath.includes("/client/")
				? frontendTestCommand
				: backendTestCommand;

			const response = await openAIService(
				`
				Assume the role of a Senior Software Engineer specializing in MERN, TypeScript. Your task is to assist in creating simple unit tests using jest for a specific component in a software project. 

				The testing needs are as follows:
				1. Write a comprehensive test suite in TypeScript using Jest.
				2. Focus on testing all functionalities of the given component.
				3. Include tests for common edge cases and potential error scenarios.
				4. Ensure that the tests are designed to be easily understandable and maintainable.
				5. Use the ${testCommand} command to run these tests.
				
				Please generate the test suite based on the provided component code, ensuring coverage for all critical aspects of the component's functionality. Avoid including any explanations or comments outside the scope of the test code itself.
				
				Here is the component code for which the test suite is required:
			
				${fileContent}
				`,
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

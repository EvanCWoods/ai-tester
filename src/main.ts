#!/usr/bin/env node
import path from "path";
import { findTypescriptFiles, writeTestFile } from "./fileUtils";
import { openAIService } from "./openAiService";
import { getUserInput } from "./getUserInput";
// import findTestCommand from "./findTestCommand"; // Uncomment if needed

export const main = async (): Promise<void> => {
	const {
		projectScope,
		selectedDirs,
		frontendDir,
		backendDir,
		openAiApiKey,
		openAiOrg,
	} = await getUserInput();

	const currentDir = process.cwd();
	let dirsToSearch = [];
	let isSpecificFolder = projectScope === "Specific Folders";

	if (projectScope === "Whole Project") {
		dirsToSearch = [frontendDir, backendDir].map((dir) =>
			path.isAbsolute(dir) ? dir : path.join(currentDir, dir),
		);
	} else if (isSpecificFolder && selectedDirs) {
		dirsToSearch = selectedDirs.map((dir) =>
			path.isAbsolute(dir) ? dir : path.join(currentDir, dir),
		);
	}

	let tsFiles = [];

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

			// OpenAI service call with original prompt
			const response = await openAIService(
				`
                Assume the role of a Senior Software Engineer specializing in MERN, TypeScript. Your task is to assist in creating simple unit tests using jest for a specific component in a software project. 

                The testing needs are as follows:
                1. Write a comprehensive test suite in TypeScript using Jest.
                2. Focus on testing all functionalities of the given component.
                4. Ensure that the tests are designed to be easily understandable and maintainable.
                5. Use the jest command to run these tests.
                
                Please generate the test suite based on the provided component code, ensuring coverage for all critical aspects of the component's functionality. Avoid including any explanations or comments outside the scope of the test code itself.
                
                Here is the component code for which the test suite is required:
            
                ${fileContent}
                `,
				openAiApiKey,
				openAiOrg,
			);
			console.log(`Generated test suite for ${file.filePath}`);

			let rootDir;
			if (isSpecificFolder) {
				rootDir = path.dirname(file.filePath);
			} else {
				rootDir = file.filePath.includes("/client/")
					? path.join(currentDir, frontendDir, "src")
					: path.join(currentDir, backendDir);
			}

			writeTestFile(file.filePath, response, rootDir, isSpecificFolder);
		}
	} else {
		console.log("No TypeScript files found.");
	}
};

main();

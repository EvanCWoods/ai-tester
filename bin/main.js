#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fileUtils_1 = require("./fileUtils");
const openAiService_1 = require("./openAiService");
const getUserInput_1 = require("./getUserInput");
const findTestCommand_1 = __importDefault(require("./findTestCommand"));
const main = async () => {
    const { frontendDir, backendDir, openAiApiKey, openAiOrg } = await (0, getUserInput_1.getUserInput)();
    const { frontendTestCommand, backendTestCommand } = (0, findTestCommand_1.default)(frontendDir, backendDir);
    console.log(frontendTestCommand, backendTestCommand);
    const currentDir = process.cwd();
    const dirsToSearch = [
        path_1.default.join(currentDir, frontendDir),
        path_1.default.join(currentDir, backendDir),
    ];
    let tsFiles = [];
    for (const dir of dirsToSearch) {
        tsFiles = tsFiles.concat((0, fileUtils_1.findTypescriptFiles)(dir));
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
            const response = await (0, openAiService_1.openAIService)(`
				Assume the role of a Senior Software Engineer specializing in MERN, TypeScript. Your task is to assist in creating simple unit tests using jest for a specific component in a software project. 

				The testing needs are as follows:
				1. Write a comprehensive test suite in TypeScript using Jest.
				2. Focus on testing all functionalities of the given component.
				3. Include tests for common edge cases and potential error scenarios.
				4. Ensure that the tests are designed to be easily understandable and maintainable.
				5. Use the ${testCommand} command to run these tests.

				If you are not confident that the tests that you are providing are correct, do not return them.
				
				Please generate the test suite based on the provided component code, ensuring coverage for all critical aspects of the component's functionality. Avoid including any explanations or comments outside the scope of the test code itself.
				
				Here is the component code for which the test suite is required:
			
				${fileContent}
				`, openAiApiKey, openAiOrg);
            console.log(`Generated test suite for ${file.filePath}`);
            const rootDir = file.filePath.includes("/client/")
                ? path_1.default.join(currentDir, frontendDir, "src") // Adjust this path as needed
                : path_1.default.join(currentDir, backendDir);
            console.log(`Generated test suite for ${file.filePath}`);
            (0, fileUtils_1.writeTestFile)(file.filePath, response, rootDir);
        }
    }
    else {
        console.log("No TypeScript files found.");
    }
};
main();

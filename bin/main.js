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
            const response = await (0, openAiService_1.openAIService)(`Please write a test suite in TypeScript for the following component with the ${testCommand} test command. Only return the code, not any explanations or markdown. Here is the component code:\n\n${fileContent}`, openAiApiKey, openAiOrg);
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

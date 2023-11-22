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
const main = async () => {
    const { frontendDir, backendDir } = await (0, getUserInput_1.getUserInput)();
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
        const firstFileContent = tsFiles[0].content;
        console.log(`Sending content of the ${tsFiles[0].filePath} file to OpenAI...`);
        const response = await (0, openAiService_1.openAIService)(`Please write a test suite in TypeScript using Jest for the following component. Only return the code, not any explanations or markdown. Here is the component code:\n\n${firstFileContent}`);
        console.log(`Generated test suite for ${tsFiles[0].filePath}`);
        (0, fileUtils_1.writeTestFile)(tsFiles[0].filePath, response);
    }
    else {
        console.log("No TypeScript files found.");
    }
};
main();

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInput = void 0;
// getUserInput.ts
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const getDirectories = (source) => fs_1.default
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "node_modules")
    .map((dirent) => dirent.name);
const getUserInput = async () => {
    const currentDir = process.cwd();
    const directories = getDirectories(currentDir);
    const answers = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "frontendDir",
            message: "Select your frontend directory:",
            choices: directories,
        },
        {
            type: "list",
            name: "backendDir",
            message: "Select your backend directory:",
            choices: directories,
        },
        {
            type: "input",
            name: "openAiApiKey",
            message: "Enter your OpenAI API Key:",
            validate: (input) => input.length > 0 || "API Key cannot be empty.",
        },
        {
            type: "input",
            name: "openAiOrg",
            message: "Enter your OpenAI Organization ID:",
            validate: (input) => input.length > 0 || "Organization ID cannot be empty.",
        },
    ]);
    return {
        frontendDir: answers.frontendDir,
        backendDir: answers.backendDir,
        openAiApiKey: answers.openAiApiKey,
        openAiOrg: answers.openAiOrg,
    };
};
exports.getUserInput = getUserInput;

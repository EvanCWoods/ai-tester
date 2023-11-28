"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInput = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getDirectories = (source) => fs_1.default
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "node_modules")
    .map((dirent) => dirent.name);
const getDirectoriesRecursively = (source, directories = []) => {
    fs_1.default.readdirSync(source, { withFileTypes: true }).forEach((dirent) => {
        if (dirent.isDirectory() &&
            dirent.name !== "node_modules" &&
            dirent.name !== ".git" &&
            dirent.name !== ".github" &&
            dirent.name !== ".venv" &&
            !dirent.name.includes("__tests__")) {
            const fullPath = path_1.default.join(source, dirent.name);
            directories.push(fullPath);
            getDirectoriesRecursively(fullPath, directories);
        }
    });
    return directories;
};
const getUserInput = async () => {
    const currentDir = process.cwd();
    const directories = getDirectories(currentDir);
    const allDirectories = getDirectoriesRecursively(currentDir);
    const scopeAnswer = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "projectScope",
            message: "Do you want to test the whole project or specific folders?",
            choices: ["Whole Project", "Specific Folders"],
        },
    ]);
    let folderAnswers = {};
    if (scopeAnswer.projectScope === "Specific Folders") {
        folderAnswers = await inquirer_1.default.prompt([
            {
                type: "checkbox",
                name: "selectedDirs",
                message: "Select folders you want to test:",
                choices: allDirectories,
            },
        ]);
    }
    else {
        folderAnswers = await inquirer_1.default.prompt([
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
        ]);
    }
    console.log(folderAnswers);
    const apiAnswers = await inquirer_1.default.prompt([
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
        projectScope: scopeAnswer.projectScope,
        ...folderAnswers,
        openAiApiKey: apiAnswers.openAiApiKey,
        openAiOrg: apiAnswers.openAiOrg,
    };
};
exports.getUserInput = getUserInput;

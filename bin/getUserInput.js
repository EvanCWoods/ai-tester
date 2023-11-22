"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInput = void 0;
// getUserInput.ts
const inquirer = require("inquirer");
const fs_1 = __importDefault(require("fs"));
const getDirectories = (source) => fs_1.default
    .readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && dirent.name !== "node_modules")
    .map((dirent) => dirent.name);
const getUserInput = async () => {
    const currentDir = process.cwd();
    const directories = getDirectories(currentDir);
    const answers = await inquirer.prompt([
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
    return {
        frontendDir: answers.frontendDir,
        backendDir: answers.backendDir,
    };
};
exports.getUserInput = getUserInput;

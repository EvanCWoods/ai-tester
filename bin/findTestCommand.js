"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findTestCommand(frontendPath, backendPath) {
    const testCommands = {
        frontendTestCommand: null,
        backendTestCommand: null,
    };
    try {
        // Read package.json for the frontend project
        const frontendPackageJsonPath = path_1.default.join(frontendPath, "package.json");
        if (fs_1.default.existsSync(frontendPackageJsonPath)) {
            const frontendPackageJson = JSON.parse(fs_1.default.readFileSync(frontendPackageJsonPath, "utf-8"));
            if (frontendPackageJson.scripts && frontendPackageJson.scripts.test) {
                testCommands.frontendTestCommand = frontendPackageJson.scripts.test;
            }
        }
    }
    catch (error) {
        console.error(`Error reading frontend package.json: ${error}`);
    }
    try {
        // Read package.json for the backend project
        const backendPackageJsonPath = path_1.default.join(backendPath, "package.json");
        if (fs_1.default.existsSync(backendPackageJsonPath)) {
            const backendPackageJson = JSON.parse(fs_1.default.readFileSync(backendPackageJsonPath, "utf-8"));
            if (backendPackageJson.scripts && backendPackageJson.scripts.test) {
                testCommands.backendTestCommand = backendPackageJson.scripts.test;
            }
        }
    }
    catch (error) {
        console.error(`Error reading backend package.json: ${error}`);
    }
    return testCommands;
}
exports.default = findTestCommand;

#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTestFile = exports.getTestFilePath = exports.findTypescriptFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const findTypescriptFiles = (dir, filelist = []) => {
    if (dir.includes("node_modules")) {
        return filelist;
    }
    const files = fs_1.default.readdirSync(dir);
    files.forEach((file) => {
        const filepath = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(filepath);
        if (stat.isDirectory()) {
            filelist = (0, exports.findTypescriptFiles)(filepath, filelist);
        }
        else if (/\.(ts|tsx)$/.test(file)) {
            const content = fs_1.default.readFileSync(filepath, "utf8");
            filelist.push({ filePath: filepath, content });
        }
    });
    return filelist;
};
exports.findTypescriptFiles = findTypescriptFiles;
const getTestFilePath = (filePath) => {
    const dirPath = path_1.default.dirname(filePath);
    const fileName = path_1.default.basename(filePath);
    const testFileName = fileName.replace(/\.(tsx|ts)$/, ".test.ts");
    const testDirPath = path_1.default.join(dirPath, "__tests__");
    return path_1.default.join(testDirPath, testFileName);
};
exports.getTestFilePath = getTestFilePath;
const writeTestFile = (filePath, content) => {
    const testFilePath = (0, exports.getTestFilePath)(filePath);
    fs_1.default.mkdirSync(path_1.default.dirname(testFilePath), { recursive: true });
    fs_1.default.writeFileSync(testFilePath, content);
};
exports.writeTestFile = writeTestFile;

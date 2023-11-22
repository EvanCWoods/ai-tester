"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeTestFile = exports.getTestFilePath = exports.findTypescriptFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const findTypescriptFiles = (dir, filelist = []) => {
    if (dir.includes("node_modules") || dir.includes("__tests__")) {
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
const getTestFilePath = (filePath, rootDir) => {
    // Assuming all your TS/TSX files are under the rootDir (e.g., ./client)
    const relativePath = path_1.default.relative(rootDir, filePath);
    const testFileName = relativePath.replace(/\.(tsx|ts)$/, ".test.ts");
    // Assuming you want to place your tests under ./client/__tests__
    return path_1.default.join(rootDir, "__tests__", testFileName);
};
exports.getTestFilePath = getTestFilePath;
const writeTestFile = (filePath, content, rootDir) => {
    const testFilePath = (0, exports.getTestFilePath)(filePath, rootDir);
    console.log(`Writing test file to ${testFilePath}`);
    fs_1.default.mkdirSync(path_1.default.dirname(testFilePath), { recursive: true });
    fs_1.default.writeFileSync(testFilePath, content);
};
exports.writeTestFile = writeTestFile;

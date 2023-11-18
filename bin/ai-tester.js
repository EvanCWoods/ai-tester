#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const openai_1 = require("openai");
const configuration = new openai_1.Configuration({
    organization: process.env.GPT_ORG,
    apiKey: process.env.GPT_APIKEY,
});
function findTypescriptFiles(dir, filelist = []) {
    if (dir.includes("node_modules")) {
        return filelist;
    }
    const files = fs_1.default.readdirSync(dir);
    files.forEach((file) => {
        const filepath = path_1.default.join(dir, file);
        const stat = fs_1.default.statSync(filepath);
        if (stat.isDirectory()) {
            filelist = findTypescriptFiles(filepath, filelist);
        }
        else if (/\.(ts|tsx)$/.test(file)) {
            const content = fs_1.default.readFileSync(filepath, "utf8");
            filelist.push({ filePath: filepath, content });
        }
    });
    return filelist;
}
const openAIService = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    const openai = new openai_1.OpenAIApi(configuration);
    const completion = yield openai.createChatCompletion({
        model: "gpt-4-1106-preview",
        messages: [
            {
                role: "user",
                content: prompt,
            },
        ],
        temperature: 1,
    });
    const data = completion.data.choices[0].message;
    return data;
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDir = process.cwd();
        const dirsToSearch = [
            path_1.default.join(currentDir, "client"),
            path_1.default.join(currentDir, "api"),
        ];
        let tsFiles = [];
        for (const dir of dirsToSearch) {
            tsFiles = tsFiles.concat(findTypescriptFiles(dir));
        }
        console.log(`Found ${tsFiles.length} TypeScript files.`);
        if (tsFiles.length > 0) {
            const firstFileContent = tsFiles[0].content;
            console.log(`Sending content of the first file to OpenAI...`);
            const response = yield openAIService(`Write a test suite for the following TypeScript code:\n\n${firstFileContent}`);
            console.log(`OpenAI response: ${response.content}`);
        }
        else {
            console.log("No TypeScript files found.");
        }
    });
}
main();

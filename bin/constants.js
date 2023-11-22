#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuration = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.configuration = new openai_1.Configuration({
    organization: process.env.GPT_ORG || "org-AlixM4CT4P7KipXYTSovHNLj",
    apiKey: process.env.GPT_APIKEY ||
        "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",
});

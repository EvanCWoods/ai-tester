#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAIConfiguration = void 0;
const openai_1 = require("openai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const openAIConfiguration = async (apiKey, org) => {
    return new openai_1.Configuration({
        organization: org,
        apiKey: apiKey,
    });
};
exports.openAIConfiguration = openAIConfiguration;

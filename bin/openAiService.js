#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAIService = void 0;
const openai_1 = require("openai");
const constants_1 = require("./constants");
const openAIService = async (prompt, apiKey, org) => {
    const config = await (0, constants_1.openAIConfiguration)(apiKey, org);
    const openai = new openai_1.OpenAIApi(config);
    const completion = await openai.createChatCompletion({
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
    // Extract only the code from the response
    const codeMatch = data?.content?.match(/```typescript([^`]*)```/);
    return codeMatch ? codeMatch[1].trim() : "";
};
exports.openAIService = openAIService;

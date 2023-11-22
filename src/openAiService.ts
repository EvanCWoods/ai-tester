#!/usr/bin/env node
import { OpenAIApi } from "openai";
import { openAIConfiguration } from "./constants";

export const openAIService = async (
	prompt: string,
	apiKey: string,
	org: string,
): Promise<string> => {
	const config = await openAIConfiguration(apiKey, org);
	const openai = new OpenAIApi(config);
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

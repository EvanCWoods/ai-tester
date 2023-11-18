#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { Configuration, OpenAIApi } from "openai";

interface FileData {
	filePath: string;
	content: string;
}

const configuration = new Configuration({
	organization: process.env.GPT_ORG,
	apiKey: process.env.GPT_APIKEY,
});

function findTypescriptFiles(
	dir: string,
	filelist: FileData[] = [],
): FileData[] {
	if (dir.includes("node_modules")) {
		return filelist;
	}

	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filepath = path.join(dir, file);
		const stat = fs.statSync(filepath);

		if (stat.isDirectory()) {
			filelist = findTypescriptFiles(filepath, filelist);
		} else if (/\.(ts|tsx)$/.test(file)) {
			const content = fs.readFileSync(filepath, "utf8");
			filelist.push({ filePath: filepath, content });
		}
	});

	return filelist;
}

const openAIService = async (prompt: string): Promise<any> => {
	const openai = new OpenAIApi(configuration);
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
	return data;
};

async function main() {
	const currentDir = process.cwd();
	const dirsToSearch = [
		path.join(currentDir, "client"),
		path.join(currentDir, "api"),
	];
	let tsFiles: FileData[] = [];

	for (const dir of dirsToSearch) {
		tsFiles = tsFiles.concat(findTypescriptFiles(dir));
	}

	console.log(`Found ${tsFiles.length} TypeScript files.`);

	if (tsFiles.length > 0) {
		const firstFileContent = tsFiles[0].content;
		console.log(`Sending content of the first file to OpenAI...`);
		const response = await openAIService(
			`Write a test suite for the following TypeScript code:\n\n${firstFileContent}`,
		);
		console.log(`OpenAI response: ${response.content}`);
	} else {
		console.log("No TypeScript files found.");
	}
}

main();

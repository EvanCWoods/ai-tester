// getUserInput.ts
import inquirer from "inquirer";
import fs from "fs";
import path from "path";

interface UserInput {
	frontendDir: string;
	backendDir: string;
	openAiApiKey: string;
	openAiOrg: string;
}

const getDirectories = (source: string) =>
	fs
		.readdirSync(source, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory() && dirent.name !== "node_modules")
		.map((dirent) => dirent.name);

export const getUserInput = async (): Promise<UserInput> => {
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
		{
			type: "input",
			name: "openAiApiKey",
			message: "Enter your OpenAI API Key:",
			validate: (input) => input.length > 0 || "API Key cannot be empty.",
		},
		{
			type: "input",
			name: "openAiOrg",
			message: "Enter your OpenAI Organization ID:",
			validate: (input) =>
				input.length > 0 || "Organization ID cannot be empty.",
		},
	]);

	return {
		frontendDir: answers.frontendDir,
		backendDir: answers.backendDir,
		openAiApiKey: answers.openAiApiKey,
		openAiOrg: answers.openAiOrg,
	};
};

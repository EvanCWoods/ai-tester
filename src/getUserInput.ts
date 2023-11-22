// getUserInput.ts
const inquirer = require("inquirer");
import fs from "fs";
import path from "path";

interface UserInput {
	frontendDir: string;
	backendDir: string;
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
	]);

	return {
		frontendDir: answers.frontendDir,
		backendDir: answers.backendDir,
	};
};

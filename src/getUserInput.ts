import inquirer from "inquirer";
import fs from "fs";
import path from "path";

interface UserInput {
	projectScope: string;
	selectedDirs?: string[];
	frontendDir?: string;
	backendDir?: string;
	openAiApiKey: string;
	openAiOrg: string;
}

const getDirectories = (source: string) =>
	fs
		.readdirSync(source, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory() && dirent.name !== "node_modules")
		.map((dirent) => dirent.name);

const getDirectoriesRecursively = (
	source: string,
	directories: string[] = [],
) => {
	fs.readdirSync(source, { withFileTypes: true }).forEach((dirent) => {
		if (
			dirent.isDirectory() &&
			dirent.name !== "node_modules" &&
			dirent.name !== ".git" &&
			dirent.name !== ".github" &&
			dirent.name !== ".venv" &&
			!dirent.name.includes("__tests__")
		) {
			const fullPath = path.join(source, dirent.name);
			directories.push(fullPath);
			getDirectoriesRecursively(fullPath, directories);
		}
	});
	return directories;
};

export const getUserInput = async (): Promise<UserInput> => {
	const currentDir = process.cwd();
	const directories = getDirectories(currentDir);
	const allDirectories = getDirectoriesRecursively(currentDir);

	const scopeAnswer = await inquirer.prompt([
		{
			type: "list",
			name: "projectScope",
			message: "Do you want to test the whole project or specific folders?",
			choices: ["Whole Project", "Specific Folders"],
		},
	]);

	let folderAnswers = {};
	if (scopeAnswer.projectScope === "Specific Folders") {
		folderAnswers = await inquirer.prompt([
			{
				type: "checkbox",
				name: "selectedDirs",
				message: "Select folders you want to test:",
				choices: allDirectories,
			},
		]);
	} else {
		folderAnswers = await inquirer.prompt([
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
	}
	console.log(folderAnswers);

	const apiAnswers = await inquirer.prompt([
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
		projectScope: scopeAnswer.projectScope,
		...folderAnswers,
		openAiApiKey: apiAnswers.openAiApiKey,
		openAiOrg: apiAnswers.openAiOrg,
	};
};

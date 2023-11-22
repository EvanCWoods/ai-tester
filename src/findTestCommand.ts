import fs from "fs";
import path from "path";
import { ITestCommandResult } from "./types/interfaces";

function findTestCommand(
	frontendPath: string,
	backendPath: string,
): ITestCommandResult {
	const testCommands: ITestCommandResult = {
		frontendTestCommand: null,
		backendTestCommand: null,
	};

	try {
		// Read package.json for the frontend project
		const frontendPackageJsonPath = path.join(frontendPath, "package.json");
		if (fs.existsSync(frontendPackageJsonPath)) {
			const frontendPackageJson = JSON.parse(
				fs.readFileSync(frontendPackageJsonPath, "utf-8"),
			);
			if (frontendPackageJson.scripts && frontendPackageJson.scripts.test) {
				testCommands.frontendTestCommand = frontendPackageJson.scripts.test;
			}
		}
	} catch (error) {
		console.error(`Error reading frontend package.json: ${error}`);
	}

	try {
		// Read package.json for the backend project
		const backendPackageJsonPath = path.join(backendPath, "package.json");
		if (fs.existsSync(backendPackageJsonPath)) {
			const backendPackageJson = JSON.parse(
				fs.readFileSync(backendPackageJsonPath, "utf-8"),
			);
			if (backendPackageJson.scripts && backendPackageJson.scripts.test) {
				testCommands.backendTestCommand = backendPackageJson.scripts.test;
			}
		}
	} catch (error) {
		console.error(`Error reading backend package.json: ${error}`);
	}

	return testCommands;
}

export default findTestCommand;

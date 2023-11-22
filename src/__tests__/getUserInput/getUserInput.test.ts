import { getUserInput } from "../../getUserInput";
import inquirer from "inquirer";
import fs from "fs";

jest.mock("inquirer");
jest.mock("fs");
import { Dirent } from "fs";

function createMockDirent(name: string, isDirectory: boolean): Dirent {
	return {
		name,
		isDirectory: () => isDirectory,
		isFile: () => !isDirectory,
		isBlockDevice: () => false,
		isCharacterDevice: () => false,
		isSymbolicLink: () => false,
		isFIFO: () => false,
		isSocket: () => false,
	} as Dirent;
}

describe("getUserInput", () => {
	it("prompts the user and returns valid input", async () => {
		// Mocking the file system to simulate directory listings
		// In your test
		jest.spyOn(fs, "readdirSync").mockReturnValue([
			createMockDirent("frontend", true),
			createMockDirent("backend", true),
			// Add other directories as needed
		]);

		// Mocking inquirer to simulate user inputs
		const mockInquirerResponse = {
			frontendDir: "frontend",
			backendDir: "backend",
			openAiApiKey: "test-api-key",
			openAiOrg: "test-org-id",
		};

		jest.spyOn(inquirer, "prompt").mockResolvedValue(mockInquirerResponse);

		const result = await getUserInput();

		expect(result).toEqual(mockInquirerResponse);
		expect(fs.readdirSync).toHaveBeenCalledWith(expect.any(String), {
			withFileTypes: true,
		});
		expect(inquirer.prompt).toHaveBeenCalledTimes(1);
	});

	// You can add more tests here to cover different scenarios like
	// - What if the directory listing is empty?
	// - What if the user provides empty inputs for API Key or Organization ID?
});

import mockFs from "mock-fs";
import findTestCommand from "../../findTestCommand";

describe("findTestCommand", () => {
	afterEach(() => {
		mockFs.restore();
	});

	it("finds test commands in both frontend and backend package.json files", () => {
		mockFs({
			"frontend/package.json": JSON.stringify({
				scripts: { test: "react-scripts test" },
			}),
			"backend/package.json": JSON.stringify({
				scripts: { test: "jest" },
			}),
		});

		const result = findTestCommand("frontend", "backend");
		expect(result).toEqual({
			frontendTestCommand: "react-scripts test",
			backendTestCommand: "jest",
		});
	});

	it("finds a test command only in frontend package.json", () => {
		mockFs({
			"frontend/package.json": JSON.stringify({
				scripts: { test: "react-scripts test" },
			}),
			backend: {},
		});

		const result = findTestCommand("frontend", "backend");
		expect(result).toEqual({
			frontendTestCommand: "react-scripts test",
			backendTestCommand: null,
		});
	});

	// Add more tests for the other scenarios...
});

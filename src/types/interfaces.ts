export interface IFileData {
	filePath: string;
	content: string;
}

export interface ITestCommandResult {
	frontendTestCommand: string | null;
	backendTestCommand: string | null;
}

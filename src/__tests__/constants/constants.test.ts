import { openAIConfiguration } from "../../constants";
import { Configuration } from "openai";

jest.mock("openai", () => {
	return {
		Configuration: jest.fn(),
	};
});

describe("openAIConfiguration", () => {
	it("should create a new Configuration with the given apiKey and organization", async () => {
		const apiKey = "testApiKey";
		const org = "testOrg";

		await openAIConfiguration(apiKey, org);

		expect(Configuration).toHaveBeenCalledWith({
			organization: org,
			apiKey: apiKey,
		});
	});
});

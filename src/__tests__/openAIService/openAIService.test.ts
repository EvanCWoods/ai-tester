import { openAIService } from "../../openAiService";
import { openAIConfiguration } from "../../constants";
import { OpenAIApi } from "openai";

jest.mock('openai', () => ({
    OpenAIApi: jest.fn().mockImplementation(() => ({
      createChatCompletion: jest.fn().mockResolvedValue({
        data: {
          choices: [{ message: { content: '```typescript\ncode snippet\n```' } }],
        },
      })),
    })),
  }));
  
  // Mock the entire module and provide a custom implementation for openAIConfiguration
  jest.mock('../../constants"', () => ({
    openAIConfiguration: jest.fn().mockResolvedValue({
      apiKey: 'test-api-key',
      organization: 'test-org',
    }),
  }));

describe("openAIService", () => {
	it("calls the OpenAI API with the correct configuration and parses the response", async () => {
		const mockConfig = { apiKey: "test", organization: "test-org" };
		jest
			.spyOn(openAIConfiguration, "openAIConfiguration")
			.mockResolvedValue(mockConfig);

		const result = await openAIService(
			"test prompt",
			"test-api-key",
			"test-org",
		);

		expect(openAIConfiguration).toHaveBeenCalledWith(
			"test-api-key",
			"test-org",
		);
		expect(OpenAIApi).toHaveBeenCalledWith(mockConfig);
		expect(result).toBe("code snippet");
	});

	// Additional tests can be added here to cover different scenarios like handling API errors, etc.
});

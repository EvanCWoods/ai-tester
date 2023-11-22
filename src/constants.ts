#!/usr/bin/env node
import { Configuration } from "openai";
import dotenv from "dotenv";

dotenv.config();

export const openAIConfiguration = async (apiKey: string, org: string) => {
	return new Configuration({
		organization: org,
		apiKey: apiKey,
	});
};

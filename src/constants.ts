#!/usr/bin/env node
import { Configuration } from "openai";
import dotenv from "dotenv";

dotenv.config();

export const configuration = new Configuration({
	organization: process.env.GPT_ORG,
	apiKey: process.env.GPT_APIKEY,
});

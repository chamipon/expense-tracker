import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import 'dotenv/config';

type Config = {
	environmentId: string;
	targets: {
		path: string;
	}[];
};

const environmentId = process.env.OP_ENVIRONMENT_ID;

if (!environmentId) {
	console.error("Missing OP_ENVIRONMENT_ID in root .env");
	process.exit(1);
}

const configPath = path.resolve("scripts/env.targets.json");

if (!fs.existsSync(configPath)) {
	console.error("Missing scripts/env.targets.json");
	process.exit(1);
}

const config: Config = JSON.parse(
	fs.readFileSync(configPath, "utf-8")
);

try {
	console.log("Fetching environment variables from 1Password...");

	// Executes:
	// op environment <environment id>
	const envOutput = execSync(
		`op environment read ${environmentId}`,
		{
			encoding: "utf-8",
			stdio: ["pipe", "pipe", "inherit"],
		}
	);

	for (const target of config.targets) {
		const fullPath = path.resolve(target.path);
		const dir = path.dirname(fullPath);

		fs.mkdirSync(dir, { recursive: true });

		fs.writeFileSync(fullPath, envOutput, "utf-8");

		console.log(`Wrote ${target.path}`);
	}

	console.log("Environment sync complete.");
} catch (error) {
	console.error("Failed to sync environment variables.");
	process.exit(1);
}
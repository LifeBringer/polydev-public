import * as readline from "readline";
import * as path from "path";
import dotenv from "dotenv";

import {
  createFilesAndFolders,
  generateProjectStructure,
} from "./utils/projectGenerator";
import chalk from "chalk";
// import { generateCode } from "./utils/codeGenerator";
// import { verifyCode } from "./utils/codeVerifier";

dotenv.config();

// Set up readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define the main function
async function main() {
  chalk.hex("#c9f277")("Welcome to My AI Software Developer!");

  // 1. Generate the project tree structure
  chalk.hex("#c9f277")("Let's start by generating the project tree structure.");
  const projectStructure = await generateProjectStructure();

  const outputPath = path.join(__dirname, "generated_project");
  await createFilesAndFolders(projectStructure, outputPath);
  chalk.hex("#c9f277")(
    "Project tree structure generated, check the generated_project folder."
  );

  // 2. Generate and write code for each file in the project tree structure
  // 3. Verify the code for each file in the project tree structure

  rl.close();
}

main().catch((error) => {
  console.error(error);
  rl.close();
});

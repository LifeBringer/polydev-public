import * as readline from "readline";
import * as path from "path";
import dotenv from "dotenv";

import {
  createFilesAndFolders,
  generateProjectStructure,
} from "./utils/projectGenerator";
import chalk from "chalk";
import { generateCodeForProject } from "./utils/codeGenerator";
import { Message } from "./utils/openai";
import { Console } from "console";
// import { generateCode } from "./utils/codeGenerator";
// import { verifyCode } from "./utils/codeVerifier";

dotenv.config();

// Set up readline interface for user interaction
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// Define the main function
async function main() {
  outputMessage("Welcome, I am your personal assistant Polydev.");

  // 1. Generate the project tree structure
  outputMessage("Let's start by generating the project tree structure.");
  const { projectStructure, messages } = await generateProjectStructure();

  // const outputPath = path.join(__dirname, "generated_project");
  const outputPath = path.join(process.cwd(), "generated_project");

  await createFilesAndFolders(projectStructure, outputPath);
  outputMessage(
    `Empty files have been generated, check the generated_project/${projectStructure[0].name} folder.`
  );

  // 2. Generate and write code for each file in the project tree structure
  outputMessage("Starting code generation");
  await generateCodeForProject(projectStructure, messages);
  outputMessage(
    "Code generation complete, check the generated_project folder."
  );

  // 3. Verify the code for each file in the project tree structure

  // rl.close();
}

function outputMessage(message: string) {
  console.log(chalk.hex("#c9f277")(message));
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  }
})();

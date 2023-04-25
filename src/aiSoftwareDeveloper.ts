import * as path from "path";
import dotenv from "dotenv";

import {
  createFilesAndFolders,
  generateProjectStructure,
} from "./polydev-lib/architect";
import { generateCodeForProject } from "./polydev-lib/assembler";
import { outputMessage } from "./polydev-lib/common";

dotenv.config();

async function main() {
  outputMessage("Welcome, I am your personal assistant Polydev.");

  // 1. Generate the project tree structure
  outputMessage("Let's start by generating the project tree structure.");
  const { projectStructure, messages } = await generateProjectStructure();

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
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  }
})();

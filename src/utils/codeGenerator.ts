import { Message } from "./openai"; // import the new util
import ora from "ora";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import {
  ProjectTreeNode,
  generateChatWrapper,
  getUserInput,
  showSpinner,
} from "./common";

export async function generateCodeForFile(
  fileNode: ProjectTreeNode,
  projectTreeNode: ProjectTreeNode[],
  messages_past: Message[],
  basePath: string
): Promise<void> {
  let codeConfirmed = false;
  let messages: Message[] = [];

  // Add the project tree structure to the messages
  messages.push({
    role: "assistant",
    content: `You are an AI Developer,
    working on the following project: ${JSON.stringify(projectTreeNode)}
    these are the previous messages: ${JSON.stringify(messages_past)}`,
  });

  const initialCodeMessage = `Generate the code for the file: '${fileNode.name}'.
  make sure to:
  - import the necessary libraries
  - define the necessary functions
  - write the necessary code
  - return the necessary values
  - not have any errors
  - write to code based on the project tree structure in previous messages
  `;
  messages.push({ role: "user", content: initialCodeMessage });

  // Generate initial code
  const spinner = showSpinner(`Generating code for ${fileNode.name}`);

  let generatedCode = await generateChatWrapper(messages);
  messages.push({ role: "system", content: generatedCode });
  spinner.stop();

  do {
    // Display the generated code
    console.log(chalk.hex("#c9f277")(generatedCode));

    // Ask for confirmation or changes, and update messages
    const descriptionMessage =
      "If you're satisfied with the generated code, type 'yes'. Otherwise, specify the changes you'd like: ";
    messages.push({ role: "system", content: descriptionMessage });
    const fileDescription = await getUserInput(descriptionMessage);
    messages.push({ role: "user", content: fileDescription });

    if (fileDescription.toLowerCase() === "yes") {
      codeConfirmed = true;
      const codeBlock = extractCodeBlock(generatedCode);
      if (!codeBlock) {
        throw new Error("Error extracting the code block");
      }
      fileNode.content = codeBlock;
      writeToFileSystem(fileNode, basePath);
      console.log(chalk.hex("#c9f277")(`Code added to '${fileNode.name}'!`));
    } else {
      // Update the code based on user input
      messages.push({
        role: "user",
        content: `Understood. Please make the following changes to the code: ${fileDescription}.`,
      });
      const spinner2 = ora(
        chalk.hex("#c9f277")(
          `Updating '${fileNode.name}' based on requests, please wait...`
        )
      ).start();
      const updatedCode = await generateChatWrapper(messages);
      messages.push({ role: "system", content: updatedCode });
      generatedCode = updatedCode;
      spinner2.stop();
    }
  } while (!codeConfirmed);
}

export async function generateCodeForProject(
  projectStructure: ProjectTreeNode[],
  messages: Message[],
  rootProjectStructure: ProjectTreeNode[] = projectStructure,
  currentPath: string = "",
  isRoot: boolean = true
): Promise<void> {
  const basePath = isRoot
    ? path.join(process.cwd(), "generated_project")
    : currentPath;

  for (const node of projectStructure) {
    if (node.type === "folder" && node.children) {
      // Pass a copy of the messages array and the rootProjectStructure to maintain context
      await generateCodeForProject(
        node.children,
        [...messages],
        rootProjectStructure,
        path.join(basePath, node.name),
        false
      );
    } else if (node.type === "file") {
      node.path = basePath; // Set the current path to the file node
      await generateCodeForFile(node, rootProjectStructure, messages, basePath);
    }
  }
}

function extractCodeBlock(message: string): string | null {
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const match = codeBlockRegex.exec(message);

  if (match && match[1]) {
    return match[1].trim();
  }
  return null;
}
function writeToFileSystem(fileNode: ProjectTreeNode, basePath: string) {
  const filePath = path.join(basePath, fileNode.name);
  fs.writeFileSync(filePath, fileNode.content || "");
}

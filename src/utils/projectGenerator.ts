import { Message, generateChat } from "./openai"; // import the new util
import * as readlineSync from "readline-sync";
import * as fs from "fs";
import * as path from "path";

import ora from "ora";
import chalk from "chalk";

export interface ProjectTreeNode {
  type: "folder" | "file";
  name: string;
  children?: ProjectTreeNode[];
  content?: string;
  path?: string;
}

/**
 * Get user input from the console.
 * @param message Message to display to the user
 * @returns User input
 */
export const getUserInput = (message: string): string => {
  const coloredMessage = chalk.hex("#b993f7")(message);
  const answer = readlineSync.question(coloredMessage);

  if (answer.trim()) {
    return answer.trim();
  } else {
    console.log("Please provide a valid input.");
    return getUserInput(message);
  }
};

/**
 *
 * @param messages
 * @returns
 */
export async function generateChatWrapper(
  messages: Message[]
): Promise<string> {
  try {
    return await generateChat(messages);
  } catch (error: any) {
    console.error("Error generating chat:", error.message);
    return "";
  }
}

/**
 * Generate project tree structure based on the user's description.
 * @returns Project tree structure
 * @throws Error if the project tree structure cannot be generated
 */
export async function generateProjectStructure(): Promise<{
  projectStructure: ProjectTreeNode[];
  messages: Message[];
}> {
  let projectStructureConfirmed = false;
  let projectStructure: ProjectTreeNode[] = [];
  // const generatedStructures: string[] = [];

  const makeSure = [
    "you only generate project tree structure for the user",
    "keep working on the project tree structure until the user is satisfied",
    "keep in mind the previous structure you mentioned",
    "to display every file and folder in the project structure, never show '...', '.../'",
    "to never display empty folders, never show 'folder/'",
    "use the following format for the project tree structure:\n├── folder1/\n│   ├── file1\n│   └── file2\n└── folder2/\n    ├── file3\n    └── file4\n",
  ];
  const rule = `make sure to do the following: ${makeSure}`;
  const messages: Message[] = [
    {
      role: "system",
      content: `Hi, I am an AI called Polydev and will genereate project structures based on your descriptions. ${rule}`,
    },
  ];

  // get project name
  const name_message = "Please enter your project name: ";
  messages.push({ role: "system", content: name_message });
  const projectName = await getUserInput(name_message);
  messages.push({ role: "user", content: projectName });

  // get project description
  const describe_message = "Please describe your desired project: ";
  messages.push({ role: "system", content: describe_message });
  const projectDescription = await getUserInput(describe_message);
  messages.push({
    role: "user",
    content: `please generate the project structure based on the name: '${projectName}'(make sure the root directory is generated from this following proper folder name formating) and description: '${projectDescription}'. make sure to only provide the project structure and no other text or comments.`,
  });

  do {
    // generate project structure
    const spinner = ora(
      chalk.hex("#c9f277")("Thinking, please wait...")
    ).start();
    const generatedProjectStructure = await generateChatWrapper(messages);
    messages.push({ role: "system", content: generatedProjectStructure });
    spinner.stop();

    // display project structure
    console.log(chalk.hex("#c9f277")(generatedProjectStructure));

    // ask for confirmation or changes, and update messages
    const message3 =
      "If you're satisfied with the project structure, type 'yes'. Otherwise, specify the changes you'd like: ";
    messages.push({ role: "system", content: message3 });

    // get confirmation or changes, and update messages
    let confirmation = await getUserInput(message3);

    if (confirmation.toLowerCase() === "yes") {
      projectStructureConfirmed = true;

      const spinner = ora(
        chalk.hex("#c9f277")("Generating, please wait...")
      ).start();

      confirmation = `yes, please output the code for the project structure : ${generatedProjectStructure}.
      types for reference:
      interface ProjectTreeNode {
        type: "folder" | "file";
        name: string;
        children?: ProjectTreeNode[];
      },
      make sure to output the code in the following format: 
      ProjectTreeNode[] = generatedProjectTreeNode`;

      messages.push({ role: "user", content: confirmation });
      const generatedProjectTreeNode = await generateChatWrapper(messages);
      try {
        projectStructure = extractGeneratedProjectTree(
          generatedProjectTreeNode
        );
      } catch (error: any) {
        console.error("Error extracting the project structure:", error.message);
        projectStructureConfirmed = false; // Reset the flag, so the loop continues
      }
      spinner.stop();
      console.log(chalk.hex("#c9f277")("Project structure generated!"));

      return { projectStructure: projectStructure, messages: messages };
    } else {
      // Add user-requested changes to the messages array
      messages.push({
        role: "user",
        content: `Understood. Please make the following changes to the project structure: ${confirmation}. ${rule}`,
      });
    }
  } while (!projectStructureConfirmed);

  return { projectStructure: projectStructure, messages: messages };
}

/**
 * Create files and folders based on the project tree structure.
 * @param projectStructure Project tree structure
 * @param basePath Base path to create the project tree structure
 * @throws Error if the files and folders cannot be created
 * @returns Promise
 */
export async function createFilesAndFolders(
  projectStructure: ProjectTreeNode[],
  basePath: string
): Promise<void> {
  try {
    fs.mkdirSync(basePath, { recursive: true });
  } catch (error: any) {
    console.error("Error creating output directory:", error.message);
    return;
  }

  for (const node of projectStructure) {
    const nodePath = path.join(basePath, node.name);

    try {
      if (node.type === "folder") {
        fs.mkdirSync(nodePath, { recursive: true });

        if (node.children) {
          await createFilesAndFolders(node.children, nodePath);
        }
      } else if (node.type === "file") {
        fs.writeFileSync(nodePath, "");
      }
    } catch (error: any) {
      console.error(
        `Error creating ${node.type}: ${node.name}.`,
        error.message
      );
    }
  }
}

function extractGeneratedProjectTree(responseText: string): ProjectTreeNode[] {
  const regex =
    /const generatedProjectTreeNode: ProjectTreeNode\[] = (\[.*\])/s;
  const match = responseText.match(regex);

  if (!match || !match[1]) {
    throw new Error("Unable to find generatedProjectTreeNode in the response.");
  }

  const codeSnippet = `
    (() => {
      return ${match[1]};
    })()
  `;

  const generatedProjectTreeNode: ProjectTreeNode[] = eval(codeSnippet);
  return generatedProjectTreeNode;
}

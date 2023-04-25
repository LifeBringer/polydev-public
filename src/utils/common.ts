import chalk from "chalk";
import ora from "ora";
import { Message } from "./openai";
import { generateChat } from "./openai";
import * as readlineSync from "readline-sync";

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
 * Generate chat based on the user's description.
 * @param messages Messages to send to the OpenAI API
 * @returns Generated chat
 **/
export function outputMessage(message: string) {
  console.log(chalk.hex("#c9f277")(message));
}

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
 * display spinner
 * @param message
 * @returns spinner
 */
export function showSpinner(message: string): ora.Ora {
  return ora(chalk.hex("#c9f277")(message)).start();
}

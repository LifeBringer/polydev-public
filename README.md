# AI Software Developer

AI Software Developer is a command-line tool that generates a project structure and source code files based on user input. The tool utilizes OpenAI's GPT-3.5-turbo model to generate the project structure and code, allowing users to interact with the AI and make adjustments until they are satisfied with the results.

## Features

- Generate project structure based on user's description
- Create files and folders for the generated project structure
- Generate code for each file in the project structure
- Allow users to modify and adjust generated code
- Verify generated code to ensure it is error-free (in progress)

## Installation

1. Clone this repository:

```bash
git clone https://github.com/mehrang92/polydev-public.git
```

2. Change directory to the project folder:

```bash
cd ai-software-developer
```

3. Install the required dependencies:

```bash
npm install
or
yarn
```

4. Rename the .env.template file to .env:

5. Set up your OpenAI API key in a .env file:

```ini
OPENAI_API_KEY=your_api_key_here
```

Replace your_api_key_here with your actual API key.

##Usage
To start the AI Software Developer, run the following command:

```bash
npm start
or
yarn start
```

Follow the prompts to describe your desired project and make adjustments as needed.

## Assembler

The Assembler generates code for each file in the project structure created by the Architect.

### Key Functions

- `generateCodeForFile(fileNode, projectTreeNode, messages_past, basePath)`: This function generates the code for the specified fileNode (a single file in the project structure). It takes the following parameters:

  - `fileNode`: A single file node from the project structure.
  - `projectTreeNode`: The entire project tree structure.
  - `messages_past`: An array of past messages between the user and the AI.
  - `basePath`: The base path where the generated code should be saved.

- `generateCodeForProject(projectStructure, messages, rootProjectStructure, currentPath, isRoot)`: This function generates code for the entire project structure by recursively calling `generateCodeForFile()` on each file in the project. It takes the following parameters:
  - `projectStructure`: The current project tree structure.
  - `messages`: An array of past messages between the user and the AI.
  - `rootProjectStructure`: The root project tree structure.
  - `currentPath`: The current path in the directory structure.
  - `isRoot`: A boolean flag indicating whether the current node is the root node.

## Architect

The Architect is responsible for generating the project structure based on the user's input.

### Key Functions

- `generateProjectStructure()`: This function generates the project tree structure based on the user's description. It returns a Promise that resolves with an object containing the project structure and the array of messages exchanged with the AI.

- `createFilesAndFolders(projectStructure, basePath)`: This function creates files and folders based on the project tree structure. It takes the following parameters:
  - `projectStructure`: The project tree structure.
  - `basePath`: The base path where the project files and folders should be created.

### Example Usage

Below is an example of how to use the Architect and Assembler to generate a project structure and code:

```javascript
import * as architect from "./polydev-lib/architect";
import * as assembler from "./polydev-lib/assembler";

(async function main() {
  // Generate project structure
  const { projectStructure, messages } =
    await architect.generateProjectStructure();

  // Create files and folders based on the project structure
  const basePath = process.cwd(); // Current working directory
  await architect.createFilesAndFolders(projectStructure, basePath);

  // Generate code for the project
  await assembler.generateCodeForProject(projectStructure, messages);
})();
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request if you find a bug or want to add a new feature.

## License

This project is licensed under the MIT License - an open source license. See [LICENSE](LICENSE) for more information.

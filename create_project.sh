#!/bin/bash

# Create the main directories
mkdir -p src/utils
mkdir -p src/types
mkdir -p polydev/generated_project
mkdir -p tests

# Create the main script file
touch src/aiSoftwareDeveloper.ts

# Create the utility script files
touch src/utils/projectGenerator.ts
touch src/utils/codeGenerator.ts
touch src/utils/codeVerifier.ts

# Create the custom TypeScript types file
touch src/types/customTypes.ts

# Create the test script files
touch tests/aiSoftwareDeveloper.spec.ts
touch tests/projectGenerator.spec.ts
touch tests/codeGenerator.spec.ts
touch tests/codeVerifier.spec.ts

# Create other necessary files
touch .env
touch .gitignore
touch package.json
touch tsconfig.json
touch README.md

echo "Project structure created successfully!"

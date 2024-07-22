# ToolBox-Pro

Welcome to the AI Toolbox documentation. This application leverages artificial intelligence to perform a variety of tasks such as writing, summarizing, and more. Explore the limitless possibilities of AI with our innovative platform.

## Features

-  Light/dark mode toggle
-  A suite of PDF operations
-  Authentication with email verification and reset password functionality
-  Exposed API for integrating with external scripts.

## Run Locally

Clone the project

```bash
git clone https://github.com/ArjunVarshney/ToolBox-Pro
```

Go to the project directory

```bash
cd ToolBox-Pro
```

Run the docker containers using

```bash
sudo make start
```

After this the user-interface will be available at `localhost:80`

> **Note** - It will take some time on the first execution, after that it will be faster in the further executions

To stop the docker containers

```sh
sudo make stop
```

> **Note** - The services will keep on running in the background if not stopped.

## Usage/Devlopment

-  After running the containers the user interface will be available at `localhost:3000`

-  For development purposes
   -  For intergrating the APIs into your own platform refer to [containers.md](containers.md)
   -  For the details of all the docker container and how to access them, for different API endpoints refer to [endpoints.md](endpoints.md)
   -  For details about the folder structure refer to [folder-structure.md](folder-structure.md)

## Tech Stack

### Website

-  **Frontend**

   -  React Typescript
   -  Next js
   -  Shadcn
   -  Tailwind

-  **Backend**

   -  Typescript
   -  Next js API directory
   -  Prisma ORM
   -  Runtime: Nodejs

-  **Databases**
   -  MongoDB
   -  AWS S3 for object storage

### AI Services

-  Python
-  Crew AI
-  Langchain
-  Tensorflow
-  Flask

### Container Management

-  Docker
-  Docker Compose

## Design Files

-  [Website Design](https://www.figma.com/design/1hm45NVNMcuKniUwSHISCV/Website-design?t=ndumJaSboTAXFyfU-1)
-  [Website Structure/Wireframe](https://www.figma.com/board/xvXAsd96d45asun7f8uck1/Website-structure?t=ndumJaSboTAXFyfU-1)
-  [System/Container Architecture](https://www.figma.com/board/uA8KmhESL016Et3Tunqyg2/Container-Architecture?t=ndumJaSboTAXFyfU-1)

## Contributing

We welcome contributions to ToolBox-Pro! Whether it's bug fixes, new features, or improvements to the documentation, your help is greatly appreciated. To contribute, follow these steps:

-  Fork the ToolBox-Pro repository.
-  Create a new branch for your changes: `git checkout -b feature/your-feature`.
-  Make your changes and commit them: `git commit -m 'Add your feature'`.
-  Push your changes to your fork: `git push origin feature/your-feature`.
-  Create a pull request against the main ToolBox-Pro repository.

## Authors

-  [@ArjunVarshney](https://github.com/ArjunVarshney)

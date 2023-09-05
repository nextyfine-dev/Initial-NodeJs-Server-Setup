# Initial Node.js Server Setup

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D%2016-brightgreen)

This repository provides a robust foundation for quickly setting up a Node.js server, ideal for developing web applications and APIs. It includes essential configurations, middleware, and error handling to streamline your project's development.

## Features

- **Express Framework**: Built on the Express framework, known for its speed and simplicity in creating web applications and APIs.
- **Middleware Stack**: Includes essential middleware components like CORS, Helmet, Morgan, and Compression, enhancing security, logging, and performance.
- **Error Handling**: Implements an error controller for consistent and user-friendly error responses.
- **TypeScript Support**: Developed in TypeScript, enabling static type checking and code maintainability.
- **Development Environment**: Equipped with Nodemon and TypeScript compiler for automatic restarts and real-time TypeScript transpilation during development.
- **Socket.io Support**: Integrates Socket.io for real-time communication, enabling interactive features.
- **Functional Programming**: Embraces functional programming principles for clean and maintainable code.
- **MySQL Database**: Connect to MySQL databases using Sequelize ORM for efficient data management.

## Getting Started

Follow these steps to start using the Node.js server setup:

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/your-username/initial-nodejs-server-setup.git
```

### 2. Install Dependencies

Navigate to the project directory and install dependencies using either npm or yarn:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

Certainly, I've added a new step to the README to run the build before starting the server for the first time:

### 3. Run the Build

Before launching the server for the first time, you need to build the project. This step compiles TypeScript code into JavaScript, preparing it for execution.

```bash
yarn run build
```

After building the project, proceed with starting the server:

### 4. Start the Server

Launch the server in development mode:

```bash
yarn run dev
```

The server will automatically restart when code changes are detected, making development smooth and efficient. Access the server at `http://localhost:3030`.

## TypeScript Folder Structure

The project adheres to a well-organized TypeScript folder structure for better code management:

- **config**: Contains configurations, environment variables, and database setup.
- **controllers**: Includes the error controller.
- **logs**: Houses the logger configuration.
- **middlewares**: Holds custom middleware functions.
- **model**: Defines data models.
- **routes**: Manages route definitions.
- **services**: Houses server-related services.
- **test**: Reserved for testing scripts.
- **types**: Contains custom type definitions.
- **utils**: Includes utility functions.
- **app.ts**: Entry point for the application.
- **server.ts**: Defines the server setup.
- **ws.ts**: Manages WebSocket configuration.

---

By utilizing this initial server setup, you can accelerate your Node.js development, saving time and effort in setting up the fundamental structure and configurations. Begin building Node.js applications and APIs confidently, knowing that you have a solid foundation to build upon. Happy coding!

## Contributing

Contributions are welcome! If you have improvements, bug fixes, or new features to contribute, please submit a pull request. Ensure that your code adheres to the established coding style and undergoes thorough testing.

## License

This project is licensed under the [MIT License](https://github.com/nextyfine-dev/Initial-NodeJs-Server-Setup/blob/master/LICENSE), granting you the freedom to use and modify the code to suit your requirements.

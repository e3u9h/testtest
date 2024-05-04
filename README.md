### Application Introduction

**CubeCU** stands for "Conveniently Connect and Communicate with U". This is a content-oriented web application that integrates social networking and content creation, offering features such as user authentication, user profiles, user interaction, posts, admin functionalities, search, chat, and recommendations.

### Application Setup Instructions

#### Prerequisites

Before you begin, ensure that `Node.js` and `MongoDB` are installed on your system. You will also need `npm` (Node Package Manager) to install the necessary dependencies.

#### Environment Setup

To set up the environment for both the client and the server, you need to install the necessary dependencies in their respective directories. Follow these steps:

1. Navigate to the client directory and install dependencies:
    ```bash
    cd ./client
    npm install --force
    npm install express(alternative)
    ```

2. Navigate to the server directory and install dependencies:
    ```bash
    cd ../server
    npm install --force
    npm install express(alternative)
    ```

*Note: The `--force` flag is used with `npm install` to force npm to fetch remote resources even if a local copy exists on disk.*

#### Running the Application

Once the setup is complete, you need to start both the client and the server. Here's how you do it:

1. Start the server:
    ```bash
    cd ./server   # Ensure you are in the server directory
    npm start
    ```

2. In a new terminal window, start the client:
    ```bash
    cd ./client   # Navigate to the client directory
    npm start
    ```

After successfully running the commands, the application will automatically open in your web browser at [http://localhost:3000](http://localhost:3000). Any startup errors will be displayed in the console.

#### Usage

Once the application is running, you can explore its functionalities as described in the specification document. The application supports various user interactions as outlined in the Introduction section.

### Application Specification

During the development and maintenance of this project, our team utilized OpenAI's tools for debugging and polishing the application.

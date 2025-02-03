# CodeFest - Collaborative Code Editor Platform

CodeFest is a modern, feature-rich collaborative code editing platform that combines real-time collaboration, AI-powered assistance, and workspace management capabilities. It provides developers with a seamless environment for coding, sharing, and executing code.

## 🚀 Features

### Core Features
- **Real-time Collaborative Editing**: Multiple users can work on the same codebase simultaneously
- **Workspace Management**: Create and manage multiple workspaces with different access levels
- **File System**: Hierarchical file and folder structure management
- **Code Execution**: Built-in code runner supporting multiple programming languages
- **AI-Powered Assistance**:
  - Code completion
  - Syntax error detection and fixes
  - Code documentation generation
  - Smart code suggestions

### Technical Features
- **Monaco Editor Integration**: Professional-grade code editing experience
- **Multiple Language Support**: Syntax highlighting and execution support for:
  - JavaScript/TypeScript
  - Python
  - Java
  - C++
  - Go
  - Rust
  - C#
- **Theme Customization**: Multiple editor themes including:
  - VS Dark
  - Light
  - Monokai
  - Night Owl
  - Chrome DevTools
  - Active4D

## 🛠️ Technology Stack

### Frontend
- React.js with Vite
- TailwindCSS for styling
- Monaco Editor for code editing
- React Router for navigation
- React Hook Form for form management

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Judge0 API for code execution
- HuggingFace API for AI features
- Google OAuth for email services

## 🏗️ Project Structure

### Backend Structure

The backend is built with Node.js and Express. It includes various controllers, models, routes, and utility functions.

### Key Files and Directories

- `src/app.js`: Main application setup.
- `src/controllers/`: Contains the controllers for handling different routes.
- `src/models/`: Contains the Mongoose models for the database.
- `src/routes/`: Contains the route definitions.
- `src/utils/`: Contains utility functions and classes.

### Running the Backend

1. Install dependencies:
   ```sh
   npm install
   ```

2. Start the development server:
   ```sh
   npm run dev
   ```

### Frontend Structure

The frontend is built with React.js and Vite. It includes various components, routes, and utility functions.

### Key Files and Directories

- `client/src/Authentication/`: Contains components for login and register.
- `client/src/Editor/`: Contains components for the code editor.
- `client/src/components/`: Contains reusable components.
- `client/src/router/`: Contains route configurations.
- `client/src/main.jsx`: Entry point of the frontend application.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Install dependencies:
```sh
cd backend
npm install
```

2. Create a `.env` file with required environment variables:
```env
PORT=8000
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_secret
JUDGE0_API_KEY=your_judge0_api_key
HUGGINGFACE_API_KEY=your_huggingface_key
```

3. Start the development server:
```sh
npm run dev
```

### Frontend Setup
1. Install dependencies:
```sh
cd client
npm install
```

2. Create a `.env` file:
```env
VITE_BACKEND_URL=http://localhost:8000
```

3. Start the development server:
```sh
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- Vinayak Palya
- Nirved Mishra
- Nischay Sinha
# CodeFest - Collaborative Code Editor Platform

CodeFest is a modern, feature-rich collaborative code editing platform that combines real-time collaboration, AI-powered assistance, and workspace management capabilities. It provides developers with a seamless environment for coding, sharing, and executing code.

## 🚀 Features

### Core Features
- **Real-time Collaborative Editing**: Multiple users can work on the same codebase simultaneously
- **Workspace Management**: Create and manage multiple workspaces with different access levels
- **File System**: Hierarchical file and folder structure management

## 🌐 Hosted Website

You can access the CodeEditor platform at [https://code-fest-six.vercel.app/](https://code-fest-six.vercel.app/)

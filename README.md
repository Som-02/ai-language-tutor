# 🌍 AI Language Tutor

An AI-powered language learning web application that helps users practice and improve their language skills through intelligent conversation. Built with the MERN stack and deployed on Vercel.

**Live Demo →** [ai-language-tutor-eight.vercel.app](https://ai-language-tutor-eight.vercel.app)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- 🤖 **AI-Powered Conversations** — Engage in real-time dialogue with an AI tutor tailored to language learning
- 🌐 **Multi-Language Support** — Practice a variety of languages with context-aware responses
- 💬 **Interactive Chat Interface** — Clean, responsive UI for seamless practice sessions
- 📱 **Responsive Design** — Works across desktop and mobile devices
- ⚡ **Fast & Lightweight** — Optimized frontend served via Vercel CDN

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, JavaScript, CSS         |
| Backend   | Node.js, Express.js               |
| AI        | OpenAI API (GPT)                  |
| Hosting   | Vercel (Frontend), Node server    |

---

## 📁 Project Structure

```
ai-language-tutor/
├── client/          # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── server/          # Express backend
│   ├── routes/
│   ├── controllers/
│   └── index.js
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Clone the Repository

```bash
git clone https://github.com/Som-02/ai-language-tutor.git
cd ai-language-tutor
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `server/` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

> ⚠️ Never commit your `.env` file. It's already listed in `.gitignore`.

---

## 🏃 Running Locally

### 1. Start the Backend

```bash
cd server
npm install
npm start
```

The server will run at `http://localhost:5000`.

### 2. Start the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The app will be available at `http://localhost:5173` (or `3000` if using Create React App).

---

## ☁️ Deployment

The frontend is deployed on **Vercel**. To deploy your own fork:

1. Push your code to GitHub
2. Import the repository on [vercel.com](https://vercel.com)
3. Set the root directory to `client`
4. Add your environment variables in the Vercel dashboard

For the backend, you can deploy to **Render**, **Railway**, or any Node.js-compatible host.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Som-02">Somnath</a>
</div>
